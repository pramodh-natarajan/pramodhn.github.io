/**
 * Created by kpbhatt on 4/15/2015.
 */
var average_aces;
function donutPosNeg(posVal, negVal) {
    average_aces = c3.generate({
        bindto: '#donut1',
        data: {
            columns: [
                ['Positive', posVal],
                ['Negative', negVal]
            ],
            type: 'donut'

        },
        size: {
            height: 333
        },
        donut: {
            title: 'Reviews'
        }
    });
}