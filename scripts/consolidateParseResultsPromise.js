function consolidator(results) {
    const consolidateParseResultsPromise = new Promise((resolve, reject) => {
        try {
            const consolidatedResults = {
                filePaths: [],
                versions: new Set(),
                consolidatedData: new Map()
            };
            results.forEach(({
                filePath,
                version,
                data
            }, i) => {
           
                consolidatedResults.filePaths.push(filePath);
                if (version) {
                    consolidatedResults.versions.add(version);
                }
                data.forEach((d, i) => {

                    if (consolidatedResults.consolidatedData.has(d.type)) {
                        const members = consolidatedResults.consolidatedData.get(d.type);
                        const uniqueMembers = [...new Set([...members, ...d.members])];
                        consolidatedResults.consolidatedData.set(d.type, uniqueMembers);
                    } else {
                        consolidatedResults.consolidatedData.set(d.type, d.members);
                    }

                });
            });

            resolve(consolidatedResults);
        } catch (err) {
            reject(err);
        }

    });
    return consolidateParseResultsPromise;
}

module.exports.consolidateParseResultsPromiseMaker = function consolidateParseResultsPromiseMaker(results) {
    return consolidator(results);
}