let x = 1,
  y = 2
// ①
let temp = x
x = y
y = temp

// ②
;[x, y] = [y, x]

// ③
x = x ^ y
y = x ^ y
x = x ^ y

// ④
x = x + y
y = x - y
x = x - y
