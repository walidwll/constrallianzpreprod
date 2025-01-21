import connectDB from "@/lib/db";
import { Project, SubCompany, Employee, Machinery } from "@/models";
import Company from "@/models/Company";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const contractorId = searchParams.get('contractorId');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        // Get company and its projects
        const company = await Company.findOne({ profils: contractorId });
        const projects = await Project.find({ companyId: company._id });

        // Get all employees and machinery from projects
        const employeeIds = projects.flatMap(project => project.employeesId);
        const machineryIds = projects.flatMap(project => project.machineryId);

        // Get SubCompany IDs from employees directly
        const employeeSubCompanyIds = await Employee.find({ 
            _id: { $in: employeeIds } 
        }).distinct('subCompanyId');

        // Get subcontractor IDs from machinery first
        const machinerySubContractorIds = await Machinery.find({ 
            _id: { $in: machineryIds } 
        }).distinct('subContractorId');

        // Then get SubCompany IDs for these subcontractors
        const machinerySubCompanyIds = await SubCompany.find({
            subContractorId: { $in: machinerySubContractorIds }
        }).distinct('_id');

        // Combine all SubCompany IDs
        const allSubCompanyIds = [...new Set([...employeeSubCompanyIds, ...machinerySubCompanyIds])];

        // Build search query for SubCompany documents
        const searchQuery = {
            _id: { $in: allSubCompanyIds }
        };

        // Get documents with search and populate
        const pipeline = [
            { $match: searchQuery },
            {
                $lookup: {
                    from: 'subcontractors',
                    localField: 'subContractorId',
                    foreignField: '_id',
                    as: 'subContractorData'
                }
            },
            { $unwind: '$subContractorData' },
            {
                $match: search ? {
                    $or: [
                        { 'subContractorData.name': { $regex: search, $options: 'i' } },
                        { 'subContractorData.email': { $regex: search, $options: 'i' } }
                    ]
                } : {}
            }
        ];

        // Execute aggregation with pagination
        const [documents, countResult] = await Promise.all([
            SubCompany.aggregate([
                ...pipeline,
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        subContractorId: '$subContractorData',
                        documents: 1
                    }
                }
            ]),
            SubCompany.aggregate([
                ...pipeline,
                { $count: 'total' }
            ])
        ]);

        const total = countResult[0]?.total || 0;

        return NextResponse.json({
            documents,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalDocuments: total
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}