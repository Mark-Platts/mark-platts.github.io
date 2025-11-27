//set 0 n and o to false before op, let op set them back again if needs be.
let step = 0;
let counterNumber = 0;
let halt = false;
let currentInstruction = '';
let currentOperation = '';
let currentValue = '0001';
let play = false;
let playSpeed = 4000;


//Gets the code at a given address and returns it as an object with keys: instr, op and val
function receiveCode(addr) {
    let hold = {};
    let divName = 'data'+String(binToDec(addr));
    let instruction = document.getElementById(divName).value;
    hold['instr'] = instruction;
    hold['op'] = instruction.slice(0,4);
    hold['val'] = instruction.slice(4);
    return(hold);
}

//checks if instruction is valid, raises alert and resets if not
function checkInstrVal(addr) {
    test = translate(addr);
    if (test.slice(4) == 'ERR') {
        alert('Instruction invalid, could not fetch');
        reset();
    }
}

//fetch: justs makes it clear that the counterNumber address is being looked at
function fetch() {
    document.getElementById("cyclePart").innerHTML = 'F';
    let divName = 'data'+String(counterNumber);
    currentInstruction = document.getElementById(divName).value;
    highlightCurrentAddress();
    step = 1;
    console.log('Fetching value from address: '+decToBin(counterNumber));
    console.log('Instruction: '+currentInstruction+'\n\n');
    checkInstrVal(decToBin(counterNumber));
}

//decode: updates the data ready for the operation to be executed
function decode() {
    document.getElementById("cyclePart").innerHTML = 'D';
    currentOperation = currentInstruction.slice(0,4);
    document.getElementById("instructionDecode").innerHTML = currentOperation;
    currentValue = currentInstruction.slice(4);
    step = 2;
    console.log('Decoding:')
    console.log('Current Op: '+currentOperation);
    console.log('Current Val: '+currentValue+'\n\n');
}

//Execute: executes the current operation and turns the counter (each subOp is responsible for the counter turn, in case of jumps)
function execute() {
    document.getElementById("cyclePart").innerHTML = 'E';
    switch(currentOperation) {
        case "0001":
            clearOP();
            console.log('Doing: Clear');
            break;
        case "0010":
            haltOP();
            console.log('Doing: Halt');
            break;
        case "0100":
            loadOP();
            console.log('Doing: Load');
            break;
        case "0101":
            saveOP();
            console.log('Doing: Save');
            break;
        case "0110":
            addOP();
            console.log('Doing: Add');
            break;
        case "0111":
            subOP();
            console.log('Doing: Subtract');
            break;
        case "1000":
            jumpOP();
            console.log('Doing: Jump');
            break;
        case "1001":
            jinOP();
            console.log('Doing: Jump if neg');
            break;
        case "1010":
            jizOP();
            console.log('Doing: Jump if zero');
            break;
        case "1011":
            jioOP();
            console.log('Doing: Jump if ovfl');
            break;
        default:
            nullOP();
            break;
    }
    step = 0;
    updateCounter();
    console.log('Executing:\n\n');
}


//resets the program
function reset() {
    if (play) {
        playPause();
    }
    step = 0;
    counterNumber = 0;
    halt = false;
    currentInstruction = '';
    currentOperation = '';
    currentValue = '';
    document.getElementById("accumulator").innerHTML = '0000';
    document.getElementById("instructionDecode").innerHTML = '0000';
    document.getElementById("InstAddReg").innerHTML = '0000';
    document.getElementById("cyclePart").innerHTML = 'S';
    updateFlags(0,0,0);
    resetHighlights();
}

//Completes the current step
function doStep() {
    if (counterNumber > 15) {
        alert('Runoff Error');
        reset();
        return;
    }
    if (halt) {
        haltCheck();
        return;
    }
    if (step == 0) {
        fetch();
        return;
    }
    else if (step == 1) {
        decode();
        return;
    }
    else if (step == 2) {
        execute();
        return;
    }
}

//In case of halt, checks if play is true
function haltCheck() {
    if (play) {
        clearInterval(playTimer);
    }
}

//starts or stops the program at the chosen speed
function playPause() {
    if (play) {
        clearInterval(playTimer);
        play = false;
    }
    else {
        getPlaySpeed();
        playTimer = setInterval(doStep, playSpeed);
        play = true;
    }
}

//opCode: 0000, does nothing but still checks flags and increments counter
function nullOP() {
    updateFlags(0,0,0);
    let acc = document.getElementById("accumulator").innerHTML;
    if (acc == '0000') {
        updateZeroFlag(1);
    }
    counterNumber++;
    updateCounter();
}

//opCode: 0001, clears the accumulator
function clearOP() {
    document.getElementById("accumulator").innerHTML = '0000';
    updateFlags(0,1,0);
    counterNumber++;
    updateCounter();
}

//opCode: 0010, halts the program
function haltOP() {
    halt = true;
    haltCheck();
}

//opCode: 0100, loads value from address into acc
function loadOP() {
    updateFlags(0,0,0);
    addrVal = receiveCode(currentValue).val;
    document.getElementById("accumulator").innerHTML = addrVal;
    if (addrVal == '0000') {
        updateFlags(0,1,0);
    }
    counterNumber++;
    updateCounter();
}

//opCode: 0101, stores acc value at the address
function saveOP() {
    updateFlags(0,0,0);
    let addressDecNumber = binToDec(currentValue);
    let divName = 'data'+String(addressDecNumber);
    document.getElementById(divName).value = '0000'+document.getElementById("accumulator").innerHTML;
    if (addrVal == '0000') {
        updateFlags(0,1,0);
    }
    counterNumber++;
    updateCounter();
    updateTrans();
}

//opCode: 0110, Adds the value at the address to the acc
function addOP() {
    updateFlags(0,0,0);
    let acc = binToDec(document.getElementById("accumulator").innerHTML); //get current accumulator value as decimal
    let addr = binToDec(currentValue); //get decimal number of opAddress
    let val = document.getElementById('data'+String(addr)).value; //get value stored at opAddress
    let num = binToDec(val.slice(4)); //slice off the empy opCode and convert to decimal
    let fin = acc + num;
    if (fin > 15) { //check if overflow and set flag
        fin -= 15;
        updateOverflowFlag(1);
    }
    if (fin == 0) {
        updateZeroFlag(1);
    }
    document.getElementById("accumulator").innerHTML = decToBin(fin);
    counterNumber++;
    updateCounter();
}

//opCode: 0111, Subtracts the value at the address from the acc
function subOP() {
    updateFlags(0,0,0);
    let acc = binToDec(document.getElementById("accumulator").innerHTML); //get current accumulator value as decimal
    let addr = binToDec(currentValue); //get decimal number of opAddress
    let val = document.getElementById('data'+String(addr)).value; //get value stored at opAddress
    let num = binToDec(val.slice(4)); //slice off the empy opCode and convert to decimal
    let fin = acc - num;
    if (fin < 0) { //check if overflow and set flag
        fin *= -1;
        updateNegativeFlag(1);
    }
    if (fin == 0) {
        updateZeroFlag(1);
    }
    document.getElementById("accumulator").innerHTML = decToBin(fin);
    counterNumber++;
    updateCounter();
}

//opCode: 1000, Jumps, setting the counter equal to the opAddress
function jumpOP() {
    updateOverflowFlag(0);
    updateNegativeFlag(0);
    counterNumber = binToDec(currentValue);
    updateCounter();
}

//opCode 1001, Jumps if negative flag is up
function jinOP() {
    let test = Number(document.getElementById("negativeFlag").innerHTML);
    if (test) {
        jumpOP();
    }
    else {
        nullOP();
    }
}

//opCode 1010, Jumps if zero flag is up
function jizOP() {
    let test = Number(document.getElementById("zeroFlag").innerHTML);
    if (test) {
        jumpOP();
    }
    else {
        nullOP();
    }
}

//opCode 1001, Jumps if overflow flag is up
function jioOP() {
    let test = Number(document.getElementById("overflowFlag").innerHTML);
    if (test) {
        jumpOP();
    }
    else {
        nullOP();
    }
}