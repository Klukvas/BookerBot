import { ISeat } from "../../../models";
import { getSeatKeyboard } from "../../../utils/get-seat-keyboard"

describe('get seat keyboard', () => {
  test('9 seats', () => {
    const seats = [
      { seatNumber: 1, _id: 'abc' }, { seatNumber: 2, _id: 'def' }, { seatNumber: 3, _id: 'ghi' },
      { seatNumber: 4, _id: 'jkl' }, { seatNumber: 5, _id: 'sfd' }, { seatNumber: 6, _id: 'fgh' },
      { seatNumber: 7, _id: 'zxc' }, { seatNumber: 8, _id: 'asd' }, { seatNumber: 9, _id: 'qwe' }
    ];
    const keyboard = getSeatKeyboard({seats: seats as ISeat[]})
    expect(keyboard.inline_keyboard).toHaveLength(3)
    keyboard.inline_keyboard.forEach((item) => {
      expect(item).toHaveLength(3)
    })
  })
  test('3 seats', () => {
    const seats = [
      { seatNumber: 7, _id: 'zxc' }, { seatNumber: 8, _id: 'asd' }, { seatNumber: 9, _id: 'qwe' }
    ];
    const keyboard = getSeatKeyboard({seats: seats as ISeat[]})
    expect(keyboard.inline_keyboard).toHaveLength(1)
    keyboard.inline_keyboard.forEach((item) => {
      expect(item).toHaveLength(3)
    })
  })
  test('2 seats', () => {
    const seats = [
      { seatNumber: 7, _id: 'zxc' }, { seatNumber: 8, _id: 'asd' }
    ];
    const keyboard = getSeatKeyboard({seats: seats as ISeat[]})
    expect(keyboard.inline_keyboard).toHaveLength(1)
    keyboard.inline_keyboard.forEach((item) => {
      expect(item).toHaveLength(2)
    })
  })
  test('4 seats', () => {
    const seats = [
      { seatNumber: 1, _id: 'abc' }, { seatNumber: 2, _id: 'def' }, 
      { seatNumber: 3, _id: 'ghi' }, { seatNumber: 7, _id: 'zxc' }
    ];
    const keyboard = getSeatKeyboard({seats: seats as ISeat[]})
    expect(keyboard.inline_keyboard).toHaveLength(2)
    keyboard.inline_keyboard.forEach((item, index) => {
      if(index === keyboard.inline_keyboard.length - 1){
        expect(item).toHaveLength(1)
      }else{
        expect(item).toHaveLength(3)
      }
      
    })
  })
})