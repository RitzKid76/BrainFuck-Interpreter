program = '+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.';

programArray = [0];
pointerLocation = 0;
inputs = [];
outputArray = [];
loops = [];
loopID = 0;
programPosition = 0;
printMode = 0;

program = formatInput(program);
scanForLoops(program);
main();

function main() {
  while(programPosition < program.length) {
    getInput();
    programPosition++;
  }
  output(outputArray);
}

function formatInput(inputstring) {
  let inputLetters = inputstring.toString().split('');
  let number = [];
  let output = [];
  while (inputLetters.length !== 0) {
    let currentChar = inputLetters.shift();
    if (currentChar >= '0' && currentChar <= '9') {
      number.unshift(currentChar);
    } else {
      if (number.length !== 0) {
        output.unshift(number.reverse().join(''));
        number = [];
      }
      output.unshift(currentChar);
    }
  }
  return output.reverse();
}

function getInput() {
  switch(program[programPosition]) {
    case '>':
      movePointer(1);
      break;
    case '<':
      movePointer(-1);
      break;
    case '+':
      if(programArray[pointerLocation] == 255) {
        programArray[pointerLocation] = 0;
      } else {
        programArray[pointerLocation]++;
      }
      break;
    case '-':
      if(programArray[pointerLocation] == 0) {
        programArray[pointerLocation] = 255;
      } else {
        programArray[pointerLocation]--;
      }
      break;
    case ',':
      programArray[pointerLocation] = inputs[0];
      inputs.shift();
      break;
    case '.':
      if(printMode == 1) {
        outputArray.push(programArray[pointerLocation]);
      } else {
        if(programArray[pointerLocation] != 13) {
          outputArray.push(String.fromCharCode(programArray[pointerLocation]));
        } else {
          output();
        }
      }
      break;
    case '[':
      loopFunction(1);
      break;
    case ']':
      loopFunction(2);
      break;
    case ':':
      inputs.push(program[programPosition + 1]);
      break;
    case ';':
      if(program[programPosition + 1] == '#') {
        printMode = 1;
      } else {
        printMode = 0;
      }
      break;
  }
}
  

function movePointer(direction) {
  if(direction > 0) {
    pointerLocation++;
    if(pointerLocation == programArray.length) {
      programArray.push(0);
    }
  } else {
    pointerLocation--;
  }
}

function scanForLoops(scanData) {
  for(let i = 0; i < scanData.length; i++) {
    loops.push(0);
    switch(scanData[i]) {
      case '[':
        loopID++;
        loops[i] = loopID;
        break;
      case ']':
        loops[i] = loopID;
        loopID--;
        break;
    }
  }
}

function loopFunction(type) {
  let bracketID = 0;
  switch(type) {
    case 1: //[
      if(programArray[pointerLocation] != 0) {
        bracketID = loops[programPosition];
        programPosition++;
        //loop
        while(loops[programPosition] != bracketID) {
          getInput();
          if(programPosition < program.length) {
            programPosition++;
          } else {
            break;
          }
        }
        getInput();
      } else {
        bracketID = loops[programPosition];
        programPosition++;
        //jump to ]
        while(loops[programPosition] != bracketID) {
          programPosition++;
        }
      }
      break;
    case 2: //]
      if(programArray[pointerLocation] != 0) {
        bracketID = loops[programPosition];
        programPosition--;
        //jump back to [
          while(loops[programPosition] != bracketID) {
            programPosition--;
          }
      } else {
        //move on
        programPosition++;
        getInput();
      }
      break;
  }
}

function output(array) {
  console.log(array.join(''));
}