import * as fs from 'fs';
import * as path from 'path';
import { sendEmail } from './mailer';
import { getRandomDelay } from './delay';

async function main() {
  try {
    const emailsCsvPath = path.join(__dirname, '..', 'emails.csv');
    const csvContent = fs.readFileSync(emailsCsvPath, 'utf-8');

    const lines = csvContent.trim().split('\n');
    const [header, ...rows] = lines;
    const emailList = rows.map(row => row.trim()).filter(Boolean);

    const emailTextPath = path.join(__dirname, '..', 'emailText.txt');
    const emailBody = fs.readFileSync(emailTextPath, 'utf-8');

    for (const recipient of emailList) {
      const delay = getRandomDelay(5, 15);

      console.log(`Ожидаем ${delay / 1000} секунд перед отправкой на ${recipient}...`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      await sendEmail(recipient, emailBody);
    }

    console.log('All letters are sucessfully sent!');
  } catch (error) {
    console.error('Some error:', error);
  }
}

main();