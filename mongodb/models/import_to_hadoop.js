const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

function import_to_hadoop(objects, directory) {
    const tempDir = '/tmp/';

    objects.forEach((object, index) => {
        const filename = `${uuidv4()}.json`;
        const filePath = `${tempDir}${filename}`;

        fs.writeFileSync(filePath, JSON.stringify(object));
        const copyCommand = `hdfs dfs -copyFromLocal ${filePath} ${directory}/${filename}`;

        exec(copyCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error in uploading file to Hadoop: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error in uploading file to Hadoop: ${stderr}`);
                return;
            }
            console.log(`File uploaded to Hadoop: ${filePath}`);
            
            // Delete the temporary JSON file after copying it to Hadoop
            fs.unlinkSync(filePath);
            console.log(`Temporary file deleted: ${filePath}`);

            // If this is the last object, indicate completion
            if (index === objects.length - 1) {
                console.log('All files uploaded to Hadoop.');
            }
        });
    });
}

module.exports = import_to_hadoop;