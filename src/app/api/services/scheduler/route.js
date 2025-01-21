import { NextResponse } from "next/server";
import { generateMonthlyReports } from '@/lib/cron/generate-reports';
import { generateSubCompanyReports } from '@/lib/cron/generate-subcompany-reports';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all';

        const results = {};

        if (type === 'all' || type === 'company') {
            results.company = await generateMonthlyReports();
        }

        if (type === 'all' || type === 'subcompany') {
            results.subcompany = await generateSubCompanyReports();
        }

        return NextResponse.json({
            message: 'Manual report generation completed',
            results
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}
