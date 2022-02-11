# threecommas-config-generator

A script to help generate DCA bots configuration and assess their performance.

# installation

You need Node.js in your machine to run this script.
After cloning the repo, be sure to run `npm install` before using the script.

# running

- Run from a terminal `node config-generator.js > results.csv`
- Open the CSV in your favorite spreadsheet and compare

# setting parameters by editing the file

Open config-generator and change the following lines to config your desired level of protection and take profit.

```
// how much of a downfall should this bot handle?
const protection = 0.50

//desired take profit
const tp = 0.015
```

# setting parameters from the command line

You can skip editing the file and set some of the script parameteres directly from the command line like in the example:

`node config-generator.js --protection=0.10 --tp=0.015 --maxbudget=1000 --baseprice=10`
