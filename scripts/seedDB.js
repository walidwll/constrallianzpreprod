import Activity from "/home/saaya/constrallianz/src/models/Activity.js";
import connectDB from "/home/saaya/constrallianz/src/lib/db.js";
import fs from 'fs/promises';

export default async function seedActivities() {
    try{
        await connectDB();
        const data = await fs.readFile('/home/saaya/constrallianz/scripts/data/activities.json');
        const jsonObject = JSON.parse(data);
        for (const activity of jsonObject) {
            delete activity._id;
            await Activity.create(activity);
        }
        console.log("Activities seeded successfully");
    }catch(err){
        console.error(err);
    }
}

seedActivities();