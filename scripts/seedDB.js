import Activity from "../src/models/Activity";
import SubActivity from "../src/models/SubActivity";
import connectDB from "../src/lib/db";
import fs from 'fs/promises';

export async function seedActivities() {
    try{
        await connectDB();
        const data = await fs.readFile('./data/activities.json');
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

export async function seedSubActivities() {
    try{
        await connectDB();
        const data = await fs.readFile('./data/subActivities.json');
        const jsonObject = JSON.parse(data);
        for (const subActivity of jsonObject) {
            delete subActivity._id;
            await SubActivity.create(subActivity);
        }
        console.log("SubActivities seeded successfully");
    }catch(err){
        console.error(err);
    }
}

