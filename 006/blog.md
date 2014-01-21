For this chart, I had to learn more about SVG's coordinate system; Particularly the difference between the `x`, `y`, and `dx`, `dy` values for the text. While you can achieve similar placing using **just** the `y` or `dy` values, the benefit comes from setting the `y` (ie. absolute) value beforehand, and using the `dy` value (ie. relative) to position/align the text dynamically. Another thing I learned ([thanks again SO!](http://stackoverflow.com/questions/19127035/what-is-the-difference-between-svgs-x-and-dx-attribute))was that setting the `dy` value to "0.35em" will vertically align the text, regardless of the final text size (since `em`s are a relative unit of measurement). This makes scaling graphs effortless.

When labelling the bars, I also found out that the SVG rotate means you have to
change the values of the `x` and `y` coordinates. Luckily (well, it's probably
not due to luck, just [mbostock](https://github.com/mbostock/) knowing his
shit) D3's axis system means I just needed to use the `xAxis` function I had
made to return the `y` value, and vice-versa.
