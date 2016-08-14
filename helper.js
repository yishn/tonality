exports.shift = function(array, shift) {
    if (shift > 0) {
        cut = array.slice(0, shift).map(x => x + 12)
        return [...array.slice(shift), ...cut]
    } else if (shift < 0) {
        cut = array.slice(shift).map(x => x - 12)
        return [...cut, ...array.slice(0, shift)]
    }

    return array.slice(0)
}
