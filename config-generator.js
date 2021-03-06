var argv = require("minimist")(process.argv.slice(2));

const calculate = (
  basePrice,
  protection,
  price_deviation,
  safety_order_step_scale,
  so_ratio,
  safety_order_volume_scale,
  tp,
  maxBudget
) => {
  // console.log(`setup:`)
  // console.log(`protection ${protection}`)
  // console.log(`price_deviation ${price_deviation}`)
  // console.log(`safety_order_step_scale ${safety_order_step_scale}`)
  // console.log(`so_ratio ${so_ratio}`)
  // console.log(`safety_order_volume_scale ${safety_order_volume_scale}`)
  // console.log(`tp ${tp}`)

  const price = 1000;
  const bov = basePrice;
  let sov = bov * so_ratio;
  let current_price = price;
  let step = 0;
  let safety_deviation = price_deviation;
  let safety_order = 0;

  let total_spent = bov;
  let total_coins = bov / price;

  while (current_price / price > 1 - protection) {
    step++;
    safety_order = safety_deviation + safety_order;
    current_price = price * (1 - safety_order);

    total_spent += sov;
    total_coins += sov / current_price;

    // for debugging steps
    // console.log(`step: ${step} running - current price ${current_price}  - safety deviation = ${safety_deviation} - safety order ${safety_order} - sov ${sov} - bought ${sov/current_price} coins`)

    sov = sov * safety_order_volume_scale;
    safety_deviation = price_deviation * safety_order_step_scale ** step;
  }

  // console.log(`spent ${total_spent} for ${total_coins} coins `)
  const average_price = total_spent / total_coins;
  // console.log(`average_price is ${average_price}`);
  const target_sell = average_price * (1 + tp);
  // console.log(`target sell is ${target_sell}`);
  const increase_by = (target_sell - current_price) / current_price;
  // console.log(`increase by is ${increase_by}`)

  // discards anything thats 8x more expensive than the base order
  // discards anything that doesn't recover well
  if (increase_by < protection * 0.8 && total_spent < maxBudget) {
    console.log(
      `${bov},${so_ratio},${protection},${price_deviation},${formatNumber(
        safety_order_step_scale
      )},${formatNumber(
        safety_order_volume_scale
      )},${tp},${step},${formatNumber(total_spent)},${formatNumber(
        increase_by
      )}`
    );
  }
};

const formatNumber = (number) => {
  return (Math.round(number * 100) / 100).toFixed(2);
};
// CONFIG

// how much of a downfall should this bot handle?
const protection = argv["protection"] || 0.05;

//desired take profit
const tp = argv["tp"] || 0.008;

// max budget - anything higher than this will be filtered out
const maxBudget = argv["maxbudget"] || 800;

// base price to be used by the calculator
const basePrice = argv["baseprice"] || 100;

// CSV header
console.log(
  `bov,so_ratio,protection,price_deviation,safety_order_step_scale,safety_order_volume_scale,tp,steps,total_spent,increase_by`
);

// USAGE:

// Calculate a single configuration
// calculate(0.15, 0.02, 1.1, 0.5, 1.1, 0.015)

// Calculate multiple options

for (
  var price_deviation = 0.0025;
  price_deviation <= 0.005;
  price_deviation += 0.001
) {
  for (
    var safety_order_step_scale = 1;
    safety_order_step_scale <= 1.55;
    safety_order_step_scale += 0.01
  ) {
    for (var so_ratio = 0.2; so_ratio <= 1.5; so_ratio += 0.05) {
      for (
        var safety_order_volume_scale = 1;
        safety_order_volume_scale <= 1.55;
        safety_order_volume_scale += 0.01
      ) {
        calculate(
          basePrice,
          protection,
          price_deviation,
          safety_order_step_scale,
          so_ratio,
          safety_order_volume_scale,
          tp,
          maxBudget
        );
      }
    }
  }
}
