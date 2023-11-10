class InstrType {
    static R = 'R';
    static I = 'I';
    static J = 'J';
}

class Instruction {
    constructor(bits) {
        this.bits = bits;
        this.opcode = parseInt(bits.slice(0, 6), 2);
        this.type = this.opcode === 0
            ? InstrType.R
            : (this.opcode === 2 || this.opcode === 3) ? InstrType.J : InstrType.I;
        this.fields = this.getFields(this.bits, this.type);
        if (this.type === InstrType.R) {
            const id = this.fields['funct'];
            const dic = MIPSDecoder.FUNCTIONS;
            if (id in dic) {
                this.name = dic[id];
            } else {
                console.log("Invalid instruction");
            }
        } else {
            const id = this.fields['opcode'];
            const dic = MIPSDecoder.OPCODES;
            this.name = id in dic ? dic[id] : "Invalid instruction";
        }
        // this.mnemonic = getMnemonic(this.fields, this.type);
    }

    toString() {
        return this.mnemonic;
    }

    getFields(bits, type) {
        if (type === InstrType.R) {
            return {
                'opcode': parseInt(bits.slice(0, 6), 2),
                'rs': parseInt(bits.slice(6, 11), 2),
                'rt': parseInt(bits.slice(11, 16), 2),
                'rd': parseInt(bits.slice(16, 21), 2),
                'shamt': parseInt(bits.slice(21, 26), 2),
                'funct': parseInt(bits.slice(26, 32), 2),
            };
        } else if (type === InstrType.I) {
            return {
                'opcode': parseInt(bits.slice(0, 6), 2),
                'rs': parseInt(bits.slice(6, 11), 2),
                'rt': parseInt(bits.slice(11, 16), 2),
                'imm': parseInt(bits.slice(16, 32), 2)
            };
        } else {
            return {
                'opcode': parseInt(bits.slice(0, 6), 2),
                'label': parseInt(bits.slice(6, 32), 2)
            };
        }
    }
}

class MIPSDecoder {
    static REGISTERS = {
        0: "$zero",
        1: "$at",
        2: "$v0",
        3: "$v1",
        4: "$a0",
        5: "$a1",
        6: "$a2",
        7: "$a3",
        8: "$t0",
        9: "$t1",
        10: "$t2",
        11: "$t3",
        12: "$t4",
        13: "$t5",
        14: "$t6",
        15: "$t7",
        16: "$s0",
        17: "$s1",
        18: "$s2",
        19: "$s3",
        20: "$s4",
        21: "$s5",
        22: "$s6",
        23: "$s7",
        24: "$t8",
        25: "$t9",
        26: "$k0",
        27: "$k1",
        28: "$gp",
        29: "$sp",
        30: "$s8",
        31: "$ra",
    };

    static OPCODES = {
        0b000000: "[R-Type]",
        // I-Type Instructions
        0b001000: "addi", // addi rt, rs, immediate
        0b001001: "addiu", // addiu rt, rs, immediate
        0b001100: "andi", // andi rt, rs, immediate
        0b000100: "beq", // beq rs, rt, label
        0b000001: "bgez", // rt = 00001	// bgez rs, label
        0b000111: "bgtz", // rt = 00000	// bgtz rs, label
        0b000110: "blez", // rt = 00000	// blez rs, label
        0b000001: "bltz", // rt = 00000	// bltz rs, label
        0b000101: "bne", // bne rs, rt, label
        0b100000: "lb", // lb rt, immediate(rs)
        0b100100: "lbu", // lbu rt, immediate(rs)
        0b100001: "lh", // lh rt, immediate(rs)
        0b100101: "lhu", // lhu rt, immediate(rs)
        0b001111: "lui", // lui rt, immediate
        0b100011: "lw", // lw rt, immediate(rs)
        0b110001: "lwc1", // lwc1 rt, immediate(rs)
        0b001101: "ori", // ori rt, rs, immediate
        0b101000: "sb", // sb rt, immediate(rs)
        0b001010: "slti", // slti rt, rs, immediate
        0b001011: "sltiu", // sltiu rt, rs, immediate
        0b101001: "sh", // sh rt, immediate(rs)
        0b101011: "sw", // sw rt, immediate(rs)
        0b111001: "swc1", // swc1 rt, immediate(rs)
        0b001110: "xori", // xori rt, rs, immediate
        // J-Type Instructions
        0b000010: "j", // j label
        0b000011: "jal", // jal label
        };

        static FUNCTIONS = {
        // R-Type Instructions
        0b100000: "add", // add rd, rs, rt
        0b100001: "addu", // addu rd, rs, rt
        0b100100: "and", // and rd, rs, rt
        0b001101: "break", // break
        0b011010: "div", // div rs, rt
        0b011011: "divu", // divu rs, rt
        0b001001: "jalr", // jalr rd, rs
        0b001000: "jr", // jr rs
        0b010000: "mfhi", // mfhi rd
        0b010010: "mflo", // mflo rd
        0b010001: "mthi", // mthi rs
        0b010011: "mtlo", // mtlo rs
        0b011000: "mult", // mult rs, rt
        0b011001: "multu", // multu rs, rt
        0b100111: "nor", // nor rd, rs, rt
        0b100101: "or", // or rd, rs, rt
        0b000000: "sll", // sll rd, rt, sa
        0b000100: "sllv", // sllv rd, rt, rs
        0b101010: "slt", // slt rd, rs, rt
        0b101011: "sltu", // sltu rd, rs, rt
        0b000011: "sra", // sra rd, rt, sa
        0b000111: "srav", // srav rd, rt, rs
        0b000010: "srl", // srl rd, rt, sa
        0b000110: "srlv", // srlv rd, rt, rs
        0b100010: "sub", // sub rd, rs, rt
        0b100011: "subu", // subu rd, rs, rt
        0b001100: "syscall", // syscall
        0b100110: "xor", // xor rd, rs, rt
    };

    parseInstruction(bits) {
        return new Instruction(bits);
    }

    decodeInstruction(instr) {
        const isLoad = [0b100000, 0b100100, 0b100001, 0b100101, 0b100011].includes(instr.opcode);
        const isStore = [0b101000, 0b101001, 0b101011].includes(instr.opcode);
        const isBranch = [0b000100, 0b000001, 0b000111, 0b000110, 0b000001, 0b000101].includes(instr.opcode);
        return {
            'ALUSrc': instr.type === InstrType.R || isBranch ? 0 : 1,
            'Branch': isBranch ? 1 : 0,
            'MemRead': isLoad ? 1 : 0,
            'MemToReg': isLoad ? 1 : (isStore || isBranch) ? null : 0,
            'MemWrite': isStore ? 1 : 0,
            'RegDst': (isStore || isBranch) ? null : instr.type === InstrType.R ? 1 : 0,
            'RegWrite': isBranch || isStore ? 0 : 1
        };
    }

    static getRegisterName(registerIndex) {
        return MIPSDecoder.REGISTERS[registerIndex];
    }

    static getRegisterIndex(registerName) {
        const invMap = Object.fromEntries(Object.entries(MIPSDecoder.REGISTERS).map(([k, v]) => [v, k]));
        return invMap[registerName];
    }
}

function myParseInt(numStr) {
    numStr = numStr.toLowerCase();
    const base = numStr.startsWith('0b') ? 2 : numStr.startsWith('0o') ? 8 : numStr.startsWith('0x') ? 16 : 10;

    return parseInt(numStr, base);
}

// function printOutput(instr, signals) {
//     console.log(`Instrução: ${instr.name}`);
//     console.log(`- Tipo: ${instr.type}`);
//     console.log(`- Campos:`);
//     for (const [field, value] of Object.entries(instr.fields)) {
//         if (field === 'opcode' && instr.opcode !== 0) {
//             console.log(`\t${field}: ${value} (${MIPSDecoder.OPCODES[value]})`);
//         } else if (field === 'funct') {
//             console.log(`\t${field}: ${value} (${MIPSDecoder.FUNCTIONS[value]})`);
//         } else if (['rs', 'rt', 'rd'].includes(field)) {
//             console.log(`\t${field}: ${value} (${MIPSDecoder.REGISTERS[value]})`);
//         } else {
//             console.log(`\t${field}: ${value}`);
//         }
//     }
//     console.log(`- Sinais de controle:`);
//     for (const [signal, value] of Object.entries(signals)) {
//         console.log(`\t${signal}: ${value}`);
//     }
// }

function decodificar() {
    var decoder = new MIPSDecoder()
    var input_value = document.getElementById("entrada").value;
    const instr = decoder.parseInstruction(`${myParseInt(input_value).toString(2).padStart(32, '0')}`);
    const signals = decoder.decodeInstruction(instr);
    
    // printOutput(instr, signals);

    document.getElementById("resultado").style.display = 'block';
    document.getElementById("tipo").innerHTML = instr.type;
    document.getElementById("bits").innerHTML = instr.bits;

    // for (const [field, value] of Object.entries(instr.fields)) {
    //     if (field === 'opcode' && instr.opcode !== 0) {
    //         document.getElementById("opcode").innerHTML = `${value} (${MIPSDecoder.OPCODES[value]})`;
    //     } else if (field === 'funct') {
    //         document.getElementById("funct").innerHTML = `${value} (${MIPSDecoder.FUNCTIONS[value]})`;
    //     } else if (['rs', 'rt', 'rd'].includes(field)) {
    //         document.getElementById(field).innerHTML = `${value} (${MIPSDecoder.REGISTERS[value]})`;
    //     } else {
    //         document.getElementById(field).innerHTML = `${value}`;
    //     }
    // }

    var campos = document.getElementById("campos");
    campos.replaceChildren();
    for (const [field, value] of Object.entries(instr.fields)) {
        if (field === 'opcode' && instr.opcode !== 0) {
            var text = `${field}: ${value} (${MIPSDecoder.OPCODES[value]})`;
        } else if (field === 'funct') {
            var text = `${field}: ${value} (${MIPSDecoder.FUNCTIONS[value]})`;
        } else if (['rs', 'rt', 'rd'].includes(field)) {
            var text = `${field}: ${value} (${MIPSDecoder.REGISTERS[value]})`;
        } else {
            var text = `${field}: ${value}`;
        }
        var newEl = document.createElement('li');
        newEl.appendChild(document.createTextNode(text));
        campos.appendChild(newEl);
        // campos.appendChild(document.createElement('li').appendChild(newText));
    }

    var sinais = document.getElementById("sinais");
    sinais.replaceChildren();
    for (const [signal, value] of Object.entries(signals)) {
        console.log(`\t${signal}: ${value}`);
        var newEl = document.createElement('li');
        var newText = document.createTextNode(`${signal}: ${value}`);
        newEl.appendChild(newText);
        sinais.appendChild(newEl);
        // document.getElementById(signal).innerHTML = `${value}`;
    }
}