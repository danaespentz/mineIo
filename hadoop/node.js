const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
const webHdfsUrl = 'http://<namenode>:<port>/webhdfs/v1';
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom endpoint to upload a file to HDFS
app.post('/upload', async (req, res) => {
    const { localFilePath, hdfsPath } = req.body;
    try {
        const response = await axios.put(`${webHdfsUrl}${hdfsPath}?op=CREATE&overwrite=true`, null, {
            params: {
                user.name: 'your_username' // Provide the username for Hadoop authentication
            }
        });

        const location = response.headers.location;
        await axios.put(location, fs.readFileSync(localFilePath));
        res.send('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error.response.data);
        res.status(500).send('Error uploading file');
    }
});

// Custom endpoint to download a file from HDFS
app.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const localFilePath = `/path/to/download/${filename}`; // Local path to download the file
    const hdfsPath = `/path/in/hdfs/${filename}`; // HDFS path of the file
    try {
        const response = await axios.get(`${webHdfsUrl}${hdfsPath}?op=OPEN`, {
            params: {
                user.name: 'your_username' // Provide the username for Hadoop authentication
            },
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(localFilePath);
        response.data.pipe(writer);
        res.send('File downloaded successfully');
    } catch (error) {
        console.error('Error downloading file:', error.response.data);
        res.status(500).send('Error downloading file');
    }
});

// Custom endpoint to list files in a directory in HDFS
app.get('/list/:directory', async (req, res) => {
    const { directory } = req.params;
    const hdfsPath = `/path/to/directory/${directory}`;
    try {
        const response = await axios.get(`${webHdfsUrl}${hdfsPath}?op=LISTSTATUS`, {
            params: {
                user.name: 'your_username' // Provide the username for Hadoop authentication
            }
        });

        const files = response.data.FileStatuses.FileStatus;
        const fileNames = files.map(file => file.pathSuffix);
        res.json(fileNames);
    } catch (error) {
        console.error('Error listing files:', error.response.data);
        res.status(500).send('Error listing files');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
