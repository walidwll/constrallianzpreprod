import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';
import Machinery from '@/models/Machinery';
import SubCompany from '@/models/SubCompany';

export async function GET(request) {
    try {
        await connectDB();
        const url = new URL(request.url);
        const subContractorId = url.searchParams.get('subContractorId');
        const resourceType = url.searchParams.get('type');
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        if (!subContractorId) {
            return NextResponse.json({ message: 'SubContractor ID is required' }, { status: 400 });
        }

        let data, total;
        
        if (resourceType === 'employees') {
            const subCompany = await SubCompany.findOne({ subContractorId });
            const [employees, employeeCount] = await Promise.all([
                Employee.find({ subCompanyId: subCompany._id })
                    .populate({
                        path: 'projectDetails.projectId',
                        select: 'name _id projectId' 
                    })
                    .skip(skip)
                    .limit(limit),
                Employee.countDocuments({ subCompanyId: subCompany._id })
            ]);

            data = employees.map(employee => {
                const totalCost = employee.workedHoursDetails.reduce((acc, detail) => {
                    return acc + (detail.workedHours * detail.hourlyRate);
                }, 0);
                const currentProject = employee.projectDetails.find(p => p.isActive);
                console.log(currentProject)
                return {
                    _id: employee._id,
                    name: employee.name,
                    isActive: employee.isActive,
                    projectId: currentProject?.projectId?.projectId || null,
                    projectName: currentProject?.projectId?.name || 'Not Assigned',
                    totalCost,
                    createdAt: employee.createdAt,
                    email: employee.email,
                    phone: employee.phone
                };
            });
            total = employeeCount;

        } else if (resourceType === 'machinery') {
            const [machinery, machineryCount] = await Promise.all([
                Machinery.find({ subContractorId })
                    .populate('projectId', 'name _id projectId')
                    .skip(skip)
                    .limit(limit),
                Machinery.countDocuments({ subContractorId })
            ]);
            data = machinery.map(machine => {
                const totalCost = machine.costDetails.reduce((acc, detail) => {
                    return acc + (detail.totalHours * machine.hourlyRate);
                }, 0);

                return {
                    _id: machine._id,
                    name: machine.name,
                    isActive: machine.isActive,
                    projectId: machine.projectId?.projectId || null,
                    projectName: machine.projectId?.name || 'Not Assigned',
                    totalCost,
                    createdAt: machine.createdAt,
                    category: machine.category,
                    model: machine.model
                };
            });
            total = machineryCount;
        }
        return NextResponse.json({
            data,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Error fetching resources:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}