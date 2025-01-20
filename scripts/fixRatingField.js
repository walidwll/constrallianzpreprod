
import connectDB from "@/lib/db";
import Employee from "@/models/Employee";

async function fixRatingField() {
    try {
        await connectDB();
        const employees = await Employee.find({});

        for (const employee of employees) {
            if (!Array.isArray(employee.rating)) {
                if (!employee.rating) {
                    employee.rating = [];
                }
                else if (typeof employee.rating === 'object') {
                    employee.rating = [employee.rating];
                }

                await employee.save();
                console.log(`Fixed rating for employee ${employee._id}`);
            }
        }

        console.log('Rating field migration completed');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

fixRatingField();