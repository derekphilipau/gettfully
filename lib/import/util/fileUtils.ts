import fs from 'fs';
import readline from 'readline';

export async function processFileLineByLine(
  filePath: string,
  processLine: (line: string) => Promise<void>
) {
  const fileStream = fs.createReadStream(filePath);

  try {
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      await processLine(line);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  } finally {
    fileStream.close();
  }
}

export async function writeJsonLFile(
  dataMap: Map<string, any>,
  outputFilePath: string
): Promise<void> {
  const outputStream = fs.createWriteStream(outputFilePath);

  return new Promise<void>(async (resolve, reject) => {
    outputStream.on('error', (err) => reject(err));

    for (const obj of dataMap.values()) {
      if (!outputStream.write(JSON.stringify(obj) + '\n')) {
        await new Promise<void>((resolveDrain) =>
          outputStream.once('drain', () => resolveDrain())
        );
      }
    }

    outputStream.end();
    outputStream.on('finish', () => resolve());
  });
}
