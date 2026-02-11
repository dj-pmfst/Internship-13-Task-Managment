export class InputHelper{
    
    static setInputsDisabled=(inputs,disable)=>Object.values(inputs).forEach(input=>input.disabled=disable);
}