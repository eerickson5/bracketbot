
export function isSingleEmoji(string){
    var emojiCompact = require('emoji.json/emoji-compact.json')
    if(emojiCompact.includes(string)){
        return true
    } else {
        return false
    }
}