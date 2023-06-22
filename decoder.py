from enum import Enum


class InstrType(Enum):
    R = 1
    I = 2
    J = 3


class Instruction:
    
    def __init__(self, bits: str) -> None:
        self.bits = bits
        self.opcode = int(bits[:6], 2)
        self.type = InstrType.R if self.opcode == 0 else \
                    InstrType.J if self.opcode == 2 or self.opcode == 3 else InstrType.I
        self.fields = self.get_fields(self.bits, self.type)
        self.name = MIPSDecoder.FUNCTIONS[self.fields['funct']] if self.type == InstrType.R else MIPSDecoder.OPCODES[self.opcode]
        self.mnemonic = self.get_mnemonic(self.fields, self.type)
    
    def __str__(self) -> str:
        return self.mnemonic
    
    @staticmethod
    def get_fields(bits: str, type: InstrType) -> dict:
        if type == InstrType.R:
            return {
                'opcode': int(bits[:6], 2),
                'rs': int(bits[6:11], 2),
                'rt': int(bits[11:16], 2),
                'rd': int(bits[16:21], 2),
                'shamt': int(bits[21:26], 2),
                'funct': int(bits[26:32], 2),
            }
        elif type == InstrType.I:
            return {
                'opcode': int(bits[:6], 2),
                'rs': int(bits[6:11], 2),
                'rt': int(bits[11:16], 2),
                'imm': int(bits[16:32], 2)
            }
        else:
            return {
                'opcode': int(bits[:6], 2),
                'label': int(bits[6:32], 2)
            }
    
    @staticmethod
    def get_mnemonic(fields: dict, type: InstrType) -> str:
        # Implemente aqui...
        # Este método deve retornar o mnemônico desta instrução. Por exemplo: addi $s0, $s1, $t0
        return None


class MIPSDecoder:
    
    REGISTERS = {
        0: '$zero',
        1: '$at',
        2: '$v0',
        3: '$v1',
        4: '$a0',
        5: '$a1',
        6: '$a2',
        7: '$a3',
        8: '$t0',
        9: '$t1',
        10: '$t2',
        11: '$t3',
        12: '$t4',
        13: '$t5',
        14: '$t6',
        15: '$t7',
        16: '$s0',
        17: '$s1',
        18: '$s2',
        19: '$s3',
        20: '$s4',
        21: '$s5',
        22: '$s6',
        23: '$s7',
        24: '$t8',
        25: '$t9',
        26: '$k0',
        27: '$k1',
        28: '$gp',
        29: '$sp',
        30: '$s8',
        31: '$ra'
    }
    
    OPCODES = {
        0b000000: '[R-Type]'                                                                                                                                                        ,
        # I-Type Instructions
        0b001000: 'addi',	            # addi rt, rs, immediate
        0b001001: 'addiu',	            # addiu rt, rs, immediate
        0b001100: 'andi',	            # andi rt, rs, immediate
        0b000100: 'beq',	            # beq rs, rt, label
        0b000001: 'bgez', # rt = 00001	# bgez rs, label
        0b000111: 'bgtz', # rt = 00000	# bgtz rs, label
        0b000110: 'blez', # rt = 00000	# blez rs, label
        0b000001: 'bltz', # rt = 00000	# bltz rs, label
        0b000101: 'bne',	            # bne rs, rt, label
        0b100000: 'lb',	                # lb rt, immediate(rs)
        0b100100: 'lbu',	            # lbu rt, immediate(rs)
        0b100001: 'lh',	                # lh rt, immediate(rs)
        0b100101: 'lhu',	            # lhu rt, immediate(rs)
        0b001111: 'lui',	            # lui rt, immediate
        0b100011: 'lw',	                # lw rt, immediate(rs)
        0b110001: 'lwc1',	            # lwc1 rt, immediate(rs)
        0b001101: 'ori',	            # ori rt, rs, immediate
        0b101000: 'sb',	                # sb rt, immediate(rs)
        0b001010: 'slti',	            # slti rt, rs, immediate
        0b001011: 'sltiu',	            # sltiu rt, rs, immediate
        0b101001: 'sh',	                # sh rt, immediate(rs)
        0b101011: 'sw',	                # sw rt, immediate(rs)
        0b111001: 'swc1',	            # swc1 rt, immediate(rs)
        0b001110: 'xori',	            # xori rt, rs, immediate
        # J-Type Instructions
        0b000010: 'j',                  # j label
        0b000011: 'jal'                 # jal label

        # (addi, addiu, andi, ori, slti, sltiu, xori)
        # instr rt, rs, immediate

        # (beq, bne)
        # instr rs, rt, label

        # (bgez, bgtz, blez, bltz)
        # instr rs, label

        # (lb, lbu, lh, lhu, lw, lwc1, sb, sh, sw, swc1)
        # instr rt, immediate(rs)

        # (lui)
        # instr rt, immediate

        # (j, jal)
        # instr label 
    }

    FUNCTIONS = {
        # R-Type Instructions
        0b100000: 'add',	            # add rd, rs, rt
        0b100001: 'addu',	            # addu rd, rs, rt
        0b100100: 'and',	            # and rd, rs, rt
        0b001101: 'break',	            # break
        0b011010: 'div',	            # div rs, rt
        0b011011: 'divu',	            # divu rs, rt
        0b001001: 'jalr',	            # jalr rd, rs
        0b001000: 'jr',	                # jr rs
        0b010000: 'mfhi',	            # mfhi rd
        0b010010: 'mflo',	            # mflo rd
        0b010001: 'mthi',	            # mthi rs
        0b010011: 'mtlo',	            # mtlo rs
        0b011000: 'mult',	            # mult rs, rt
        0b011001: 'multu',	            # multu rs, rt
        0b100111: 'nor',	            # nor rd, rs, rt
        0b100101: 'or',	                # or rd, rs, rt
        0b000000: 'sll',	            # sll rd, rt, sa
        0b000100: 'sllv',	            # sllv rd, rt, rs
        0b101010: 'slt',	            # slt rd, rs, rt
        0b101011: 'sltu',	            # sltu rd, rs, rt
        0b000011: 'sra',	            # sra rd, rt, sa
        0b000111: 'srav',	            # srav rd, rt, rs
        0b000010: 'srl',                # srl rd, rt, sa
        0b000110: 'srlv',	            # srlv rd, rt, rs
        0b100010: 'sub',	            # sub rd, rs, rt
        0b100011: 'subu',	            # subu rd, rs, rt
        0b001100: 'syscall',	        # syscall
        0b100110: 'xor',	            # xor rd, rs, rt

        # (add, addu, and, nor, or, slt, sltu, sub, subu, xor)
        # instr rd, rs, rt 

        # (div, divu, mult, multu) 
        # instr rs, rt

        # (break, syscall)
        # instr

        # (jalr)
        # instr rd, rs

        # (jr, mthi, mtlo)
        # instr rs

        # (mfhi, mflo)
        # instr rd

        # (sll, sra, srl)
        # rd, rt, sa

        # (sllv, srav, srlv)
        # rd, rt, rs

    }
    
    def parse_instruction(self, bits: str) -> Instruction:
        return Instruction(bits)
    
    def decode_instruction(self, instr: Instruction) -> dict:
        is_load = instr.opcode in  [0b100000, 0b100100, 0b100001, 0b100101, 0b100011]
        is_store = instr.opcode in [0b101000, 0b101001, 0b101011]
        is_branch = instr.opcode in [0b000100, 0b000001, 0b000111, 0b000110, 0b000001, 0b000101]
        return {
            'ALUSrc': 0 if instr.type == InstrType.R or is_branch else 1,
            'Branch': 1 if is_branch else 0,
            'MemRead': 1 if is_load else 0,
            'MemToReg': 1 if is_load else None if is_store or is_branch else 0,
            'MemWrite': 1 if is_store else 0,
            'RegDst': None if is_store or is_branch else 1 if instr.type == InstrType.R else 0,
            'RegWrite': 0 if is_branch or is_store else 1
        }
        
    @staticmethod
    def get_register_name(register_index: int) -> str:
        return MIPSDecoder.REGISTERS[register_index]
    
    @staticmethod
    def get_register_index(register_name: str) -> int:
        inv_map = { v: k for k, v in MIPSDecoder.REGISTERS.items() }
        return inv_map[register_name]
    

def parse_int(num_str: str) -> int:
    num_str = num_str.lower()
    base = 2 if num_str.startswith('0b') else 8 if num_str.startswith('0o') else \
           16 if num_str.startswith('0x') else 10
    return int(num_str, base)


def print_output(instr: Instruction, signals: dict) -> None:
    print(f'Instrução: {instr.name}')
    print(f'- Tipo: {instr.type.name}')
    print(f'- Campos:')
    for field, value in instr.fields.items():
        if field == 'opcode' and instr.opcode != 0:
            print(f'\t{field}: {value} ({MIPSDecoder.OPCODES[value]})')
        elif field == 'funct':
            print(f'\t{field}: {value} ({MIPSDecoder.FUNCTIONS[value]})')
        elif field == 'rs' or field == 'rt' or field == 'rd':
            print(f'\t{field}: {value} ({MIPSDecoder.REGISTERS[value]})')
        else:
            print(f'\t{field}: {value}')
    print(f'- Sinais de controle:')
    for signal, value in signals.items():
        print(f'\t{signal}: {value}')


def main():
    decoder = MIPSDecoder()
    print("--- [Decodificar de instruções MIPS] ---")
    while True:
        print("Digite o [inteiro] da instrução | [''] para sair:", end=' ')
        input_value = input().strip()
        if not input_value:
            break
        instr = decoder.parse_instruction(f'{parse_int(input_value):032b}')
        signals = decoder.decode_instruction(instr)
        print_output(instr, signals)
        

if __name__ == '__main__':
    main()