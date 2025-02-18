import * as fs from 'fs';
import * as path from 'path';
import { sendEmail } from './mailer';
import { getRandomDelay } from './delay';

function getEmailList(csvPath: string): string[] {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');

  const emailList = lines.map((row) => row.trim()).filter(Boolean);
  return emailList;
}

function getRandomTemplate(emailTextsDir: string): {
  subject: string;
  body: string;
} {
  const templates = fs.readdirSync(emailTextsDir);

  if (templates.length === 0) {
    throw new Error('Files not founded in folder emailTexts');
  }

  const randomIndex = Math.floor(Math.random() * templates.length);
  const chosenTemplateFile = templates[randomIndex];
  console.log(`Selected template: ${chosenTemplateFile}`);

  const templatePath = path.join(emailTextsDir, chosenTemplateFile);
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  const templateLines = templateContent.split('\n').map((line) => line.trim());

  const subject = templateLines[0];
  const body = templateLines.slice(2).join('\n');

  return { subject, body };
}

async function main() {
  try {
    const emailsCsvPath = path.join(__dirname, '..', 'emails.csv');
    const emailList = getEmailList(emailsCsvPath);

    const emailTextsDir = path.join(__dirname, '..', 'emailTexts');
    const { subject, body } = getRandomTemplate(emailTextsDir);

    for (const recipient of emailList) {
      const delay = getRandomDelay(5, 15);
      console.log(
        `Waiting ${delay / 1000} seconds before sending to ${recipient}...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      await sendEmail(recipient, subject, body);
    }

    console.log('All letters are succesfully sent!');
  } catch (error) {
    console.error('Some error:', error);
  }
}

main();
