# threecommas-config-generator

A script to help generate DCA bots configuration and assess their performance.

# installation

You need Node.js in your machine to run this script.

# setting up

Open config-generator and change the following lines to config your desired level of protection and take profit.

```
// how much of a downfall should this bot handle?
const protection = 0.50

//desired take profit
const tp = 0.015
```

# running

- Run from a terminal `node config-generator.js > results.csv`
- Open the CSV in your favorite spreadsheet and compare
