import cron from 'node-cron';
import { generateMonthlyReports } from './lib/cron/generate-reports.js';
import { generateSubCompanyReports } from './lib/cron/generate-subcompany-reports.js';
import './models/index.js'; 

let cronJobs = {};

function initializeScheduler() {
  // Stop existing jobs if any
  Object.values(cronJobs).forEach(job => job?.stop());

  console.log(`Initializing scheduler in ${process.env.NODE_ENV}`);

  // Schedule company reports
  cronJobs.companyReports = cron.schedule('0 0 21 * *', async () => {
    console.log(`Running company report generation at ${new Date().toLocaleString()}`);
    await generateMonthlyReports();
  });

  // Schedule subcompany reports
  cronJobs.subcompanyReports = cron.schedule('0 0 21 * *', async () => {
    console.log(`Running subcompany report generation at ${new Date().toLocaleString()}`);
    await generateSubCompanyReports();
  });

  return cronJobs;
}

export { initializeScheduler };