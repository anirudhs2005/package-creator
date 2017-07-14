# package-creator

## How to install?
1. git clone https://github.com/anirudhs2005/package-creator
1. npm install
1. Place only the package.xmls and buildnotes that you want in the inputs directory.
1. Place your Stash code inside inputs/Stash/src
1. Outputs/deployments/deploymentPackage/src is automatically created at package-creator level
1. Create a vars.env inside the config folder. Take the format from vars_sample.env
1. Run node index.js at package-creator level