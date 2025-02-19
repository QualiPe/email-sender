import * as fs from 'fs';
import * as path from 'path';
import { sendEmail } from './mailer';
import { getRandomDelay } from './delay';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

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
  logger.debug(`Selected template: ${chosenTemplateFile}`);

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

    const failedEmails: string[] = []

    for (const recipient of emailList) {
      const { subject, body } = getRandomTemplate(emailTextsDir);

      const delay = getRandomDelay(5, 15);
      logger.log(
        `Waiting ${delay / 1000} seconds before sending to ${recipient}...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      try {
        await sendEmail(recipient, subject, body);
      } catch (error) {
        logger.error(`Failed to send email to ${recipient}: ${error.message}`);
        failedEmails.push(recipient);
      }
    }

    if (failedEmails.length > 0) {
      const failedFilePath = path.join(__dirname, '..', 'failed-emails.txt');
      fs.writeFileSync(failedFilePath, failedEmails.join('\n'), 'utf-8');
      logger.warn(`Failed addresses were saved to: ${failedFilePath}`);
    }

    logger.debug('All letters are successfully sent!');
  } catch (error) {
    logger.error('Some error:', error.stack);
  }
}

main();
