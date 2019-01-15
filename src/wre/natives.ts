import { flatMap, last, zipObj } from '../extensions'
import { CALL, compile, Evaluation, FALSE_ID, Frame, INTERRUPT, Locals, Operations, PUSH, RuntimeObject, SWAP, TRUE_ID, VOID_ID } from '../interpreter'
import log from '../log'
import { Id, Method, Singleton } from '../model'
import utils from '../utils'

const { random, floor, ceil } = Math
const { keys } = Object

// TODO:
// tslint:disable:variable-name

// TODO: tests

export default {
  wollok: {

    lang: {

      Exception: {
        getFullStackTrace: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        getStackTrace: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
      },

      Object: {

        '===': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.id === other.id ? TRUE_ID : FALSE_ID)
        },

        'identity': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.String', self.id))
        },

        'instanceVariables': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },

        'instanceVariableFor': (_self: RuntimeObject, _name: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },

        'resolve': (_self: RuntimeObject, _name: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },

        'kindName': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.String', self.module))
        },

        'className': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.String', self.module))
        },

        'toString': (self: RuntimeObject) => (evaluation: Evaluation) => {
          // TODO: Improve?
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.String', `${self.module}[${keys(self.fields).map(key =>
            `${key} = ${self.fields[key]}`
          ).join(', ')}]`))
        },
      },

      Set: {
        'initialize': (_self: RuntimeObject, ) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },

        'anyOne': (_self: RuntimeObject, ) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'fold': (_self: RuntimeObject, _initialValue: RuntimeObject, _closure: RuntimeObject) =>
          (_evaluation: Evaluation) => {
            /* TODO:*/
            throw new ReferenceError('To be implemented')
          },
        'add': (_self: RuntimeObject, _element: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'remove': (_self: RuntimeObject, _element: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'size': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'clear': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },

        'join': (_self: RuntimeObject, _separator: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/
          if (arguments.length === 0 || arguments.length === 1) throw new ReferenceError('To be implemented')
          throw new ReferenceError('To be implemented')
        },

        '==': (_self: RuntimeObject, _other: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
      },

      List: {
        initialize: (self: RuntimeObject, ) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          self.innerValue = self.innerValue || []
          pushOperand(VOID_ID)
        },

        get: (self: RuntimeObject, index: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, interrupt, addInstance } = Operations(evaluation)
          const valueId = self.innerValue[index.innerValue]
          if (!valueId) return interrupt('exception', addInstance('wollok.lang.BadParameterException'))
          pushOperand(valueId)
        },

        fold: (self: RuntimeObject, initialValue: RuntimeObject, closure: RuntimeObject) =>
          (evaluation: Evaluation) => {
            last(evaluation.frameStack)!.resume.push('return')
            evaluation.frameStack.push({
              instructions: [
                ...flatMap((id: Id<'Linked'>) => [
                  PUSH(closure.id),
                  PUSH(id),
                ])([...self.innerValue].reverse()),
                PUSH(initialValue.id),
                ...flatMap(() => [
                  SWAP,
                  CALL('apply', 2),
                ])(self.innerValue),
                INTERRUPT('return'),
              ],
              nextInstruction: 0,
              locals: { self: closure.id },
              operandStack: [],
              resume: [],
            })
          },

        add: (self: RuntimeObject, element: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          self.innerValue.push(element.id)
          pushOperand(VOID_ID)
        },

        remove: (self: RuntimeObject, element: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, getInstance } = Operations(evaluation)
          const index = self.innerValue.findIndex((id: string) => getInstance(id).innerValue === element.innerValue)
          if (index > -1) self.innerValue.splice(index, 1)
          pushOperand(VOID_ID)
        },

        size: (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.Number', self.innerValue.length))
        },

        clear: (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          self.innerValue.splice(0, self.innerValue.length)
          pushOperand(VOID_ID)
        },

      },

      Dictionary: {
        put: (_self: RuntimeObject, _key: RuntimeObject, _value: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        basicGet: (_self: RuntimeObject, _key: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        remove: (_self: RuntimeObject, _key: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        keys: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        values: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        forEach: (_self: RuntimeObject, _closure: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        clear: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
      },

      Number: {
        '===': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue === other.innerValue ? TRUE_ID : FALSE_ID)
        },

        '-_': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance(self.module, -self.innerValue))
        },

        '+': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue + other.innerValue))
        },

        '-': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue - other.innerValue))
        },

        '*': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue * other.innerValue))
        },

        '/': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand, interrupt } = Operations(evaluation)
          if (other.innerValue === 0) interrupt('exception', addInstance('wollok.lang.BadParameterException'))
          pushOperand(addInstance(self.module, self.innerValue / other.innerValue))
        },

        '**': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue ** other.innerValue))
        },

        '%': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue % other.innerValue))
        },

        'div': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance(self.module, Math.round(self.innerValue / other.innerValue)))
        },

        'toString': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { addInstance, pushOperand } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.String', `${self.innerValue}`))
        },

        '>': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue > other.innerValue ? TRUE_ID : FALSE_ID)
        },

        '>=': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue >= other.innerValue ? TRUE_ID : FALSE_ID)
        },

        '<': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue < other.innerValue ? TRUE_ID : FALSE_ID)
        },

        '<=': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue <= other.innerValue ? TRUE_ID : FALSE_ID)
        },

        'abs': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          if (self.innerValue > 0) pushOperand(self.id)
          else pushOperand(addInstance(self.module, -self.innerValue))
        },

        'roundUp': (self: RuntimeObject, decimals: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance, interrupt } = Operations(evaluation)

          if (decimals.module !== self.module || decimals.innerValue < 0)
            return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          pushOperand(addInstance(self.module, ceil(self.innerValue * (10 ** decimals.innerValue)) / (10 ** decimals.innerValue)))
        },

        'truncate': (self: RuntimeObject, decimals: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance, interrupt } = Operations(evaluation)

          if (decimals.module !== self.module || decimals.innerValue < 0)
            return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          const num = self.innerValue.toString()
          const decimalPosition = num.indexOf('.')

          pushOperand(decimalPosition >= 0
            ? addInstance(self.module, Number(num.slice(0, decimalPosition + decimals.innerValue + 1)))
            : self.id
          )
        },

        'randomUpTo': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },

        'gcd': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
      },


      String: {
        'length': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.Number', self.innerValue.length))
        },

        'concat': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue + other.innerValue))
        },

        'startsWith': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, interrupt, addInstance } = Operations(evaluation)

          if (typeof other.innerValue !== 'string')
            return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          pushOperand(self.innerValue.startsWith(other.innerValue) ? TRUE_ID : FALSE_ID)
        },

        'endsWith': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, interrupt, addInstance } = Operations(evaluation)

          if (typeof other.innerValue !== 'string')
            return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          pushOperand(self.innerValue.endsWith(other.innerValue) ? TRUE_ID : FALSE_ID)
        },

        'indexOf': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance, interrupt } = Operations(evaluation)
          const value = self.innerValue.indexOf(other.innerValue)

          // TODO: change this to just throw an exception and wrap it in the call on the interpreter
          if (value < 0) return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          pushOperand(addInstance('wollok.lang.Number', value))
        },

        'lastIndexOf': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance, interrupt } = Operations(evaluation)
          const value = self.innerValue.lastIndexOf(other.innerValue)

          // TODO: change this to just throw an exception and wrap it in the call on the interpreter
          if (value < 0) return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          pushOperand(addInstance('wollok.lang.Number', value))
        },

        'toLowerCase': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue.toLowerCase()))
        },

        'toUpperCase': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue.toUpperCase()))
        },

        'trim': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          pushOperand(addInstance(self.module, self.innerValue.trim()))
        },

        '<': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue < other.innerValue ? TRUE_ID : FALSE_ID)
        },

        '>': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue > other.innerValue ? TRUE_ID : FALSE_ID)
        },

        'contains': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, interrupt, addInstance } = Operations(evaluation)

          if (typeof other.innerValue !== 'string')
            return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          pushOperand(self.innerValue.indexOf(other.innerValue) >= 0 ? TRUE_ID : FALSE_ID)
        },

        'substring': (self: RuntimeObject, startIndex: RuntimeObject, endIndex?: RuntimeObject) =>
          (evaluation: Evaluation) => {
            const { pushOperand, addInstance, interrupt } = Operations(evaluation)

            if (typeof startIndex.innerValue !== 'number' || endIndex && typeof endIndex.innerValue !== 'number')
              return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

            pushOperand(addInstance(self.module, self.innerValue.slice(startIndex.innerValue, endIndex && endIndex.innerValue)))
          },

        'replace': (self: RuntimeObject, expression: RuntimeObject, replacement: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, interrupt, addInstance } = Operations(evaluation)

          if (typeof expression.innerValue !== 'string' || typeof replacement.innerValue !== 'string')
            return interrupt('exception', addInstance('wollok.lang.BadParameterException'))

          pushOperand(addInstance(self.module, self.innerValue.replace(new RegExp(expression.innerValue, 'g'), replacement.innerValue)))
        },

        'toString': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.id)
        },

        '==': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue === other.innerValue ? TRUE_ID : FALSE_ID)
        },
      },

      Boolean: {

        '&&': (self: RuntimeObject, closure: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)

          if (self.id === FALSE_ID) return pushOperand(self.id)

          last(evaluation.frameStack)!.resume.push('return')
          evaluation.frameStack.push({
            instructions: [
              PUSH(closure.id),
              CALL('apply', 0),
              INTERRUPT('return'),
            ],
            nextInstruction: 0,
            locals: {},
            operandStack: [],
            resume: [],
          })
        },

        '||': (self: RuntimeObject, closure: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)

          if (self.id === TRUE_ID) return pushOperand(self.id)

          last(evaluation.frameStack)!.resume.push('return')
          evaluation.frameStack.push({
            instructions: [
              PUSH(closure.id),
              CALL('apply', 0),
              INTERRUPT('return'),
            ],
            nextInstruction: 0,
            locals: {},
            operandStack: [],
            resume: [],
          })
        },

        'toString': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.String', self.innerValue.toString()))
        },

        '==': (self: RuntimeObject, other: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue === other.innerValue ? TRUE_ID : FALSE_ID)
        },

        '!_': (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          pushOperand(self.innerValue ? FALSE_ID : TRUE_ID)
        },
      },

      Range: {
        forEach: (self: RuntimeObject, closure: RuntimeObject) => (evaluation: Evaluation) => {
          const { getInstance, addInstance } = Operations(evaluation)
          const start = getInstance(self.fields.start)
          const end = getInstance(self.fields.end)
          const step = getInstance(self.fields.step)

          const values = []
          if (start.innerValue <= end.innerValue && step.innerValue > 0)
            for (let i = start.innerValue; i <= end.innerValue; i += step.innerValue) values.unshift(i)

          if (start.innerValue >= end.innerValue && step.innerValue < 0)
            for (let i = start.innerValue; i >= end.innerValue; i += step.innerValue) values.unshift(i)

          const valueIds = values.map(v => addInstance('wollok.lang.Number', v)).reverse()

          last(evaluation.frameStack)!.resume.push('return')
          evaluation.frameStack.push({
            instructions: [
              ...flatMap((id: Id<'Linked'>) => [
                PUSH(closure.id),
                PUSH(id),
                CALL('apply', 1),
              ])(valueIds),
              PUSH(VOID_ID),
              INTERRUPT('return'),
            ],
            nextInstruction: 0,
            locals: { self: self.id },
            operandStack: [],
            resume: [],
          })
        },

        anyOne: (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { getInstance, addInstance, pushOperand } = Operations(evaluation)
          const start = getInstance(self.fields.start)
          const end = getInstance(self.fields.end)
          const step = getInstance(self.fields.step)

          const values = []
          if (start.innerValue <= end.innerValue && step.innerValue > 0)
            for (let i = start.innerValue; i <= end.innerValue; i += step.innerValue) values.unshift(i)

          if (start.innerValue >= end.innerValue && step.innerValue < 0)
            for (let i = start.innerValue; i >= end.innerValue; i += step.innerValue) values.unshift(i)

          pushOperand(addInstance('wollok.lang.Number', values[floor(random() * values.length)]))
        },
      },

      Closure: {
        // TODO: maybe we can do this better once Closure is a reified node?
        saveContext: (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand } = Operations(evaluation)
          const context: Frame[] = evaluation.frameStack.slice(0, -1).map(frame => ({
            instructions: [],
            nextInstruction: 0,
            locals: frame.locals,
            operandStack: [],
            resume: [],
          }))

          self.innerValue = context
          pushOperand(VOID_ID)
        },

        apply: (self: RuntimeObject, ...args: (RuntimeObject | undefined)[]) => (evaluation: Evaluation) => {
          const { resolve, methodLookup } = utils(evaluation.environment)
          const { addInstance } = Operations(evaluation)

          const apply = resolve<Singleton<'Linked'>>(self.module).members.find(({ name }) => name === '<apply>') as Method<'Linked'>
          const argIds = args.map(arg => arg ? arg.id : VOID_ID)
          const parameterNames = apply.parameters.map(({ name }) => name)
          const hasVarArg = apply.parameters.some(parameter => parameter.isVarArg)

          if (
            hasVarArg && args.length < apply.parameters.length - 1 ||
            !hasVarArg && args.length !== apply.parameters.length
          ) {
            log.warn('Method not found:', self.module, '>> <apply> /', args.length)

            const messageNotUnderstood = methodLookup('messageNotUnderstood', 2, resolve(self.module))!
            const nameId = addInstance('wollok.lang.String', 'apply')
            const argsId = addInstance('wollok.lang.List', argIds)

            last(evaluation.frameStack)!.resume.push('return')
            evaluation.frameStack.push({
              instructions: compile(evaluation.environment)(messageNotUnderstood.body!),
              nextInstruction: 0,
              locals: { ...zipObj(messageNotUnderstood.parameters.map(({ name }) => name), [nameId, argsId]), self: self.id },
              operandStack: [],
              resume: [],
            })

            return
          }

          let locals: Locals
          if (hasVarArg) {
            const restId = addInstance('wollok.lang.List', argIds.slice(apply.parameters.length - 1))
            locals = {
              ...zipObj(parameterNames.slice(0, -1), argIds),
              [last(apply.parameters)!.name]: restId,
            }
          } else {
            locals = { ...zipObj(parameterNames, argIds) }
          }

          last(evaluation.frameStack)!.resume.push('return')

          self.innerValue.forEach((frame: Frame) => evaluation.frameStack.push(frame))

          evaluation.frameStack.push({
            instructions: [
              ...compile(evaluation.environment)(apply.body!),
              PUSH(VOID_ID),
              INTERRUPT('return'),
            ],
            nextInstruction: 0,
            locals,
            operandStack: [],
            resume: [],
          })

        },

        toString: (self: RuntimeObject) => (evaluation: Evaluation) => {
          const { pushOperand, addInstance } = Operations(evaluation)
          pushOperand(addInstance('wollok.lang.String', `Closure#${self.id}`))
        },
      },

      Date: {
        'toString': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        '==': (_self: RuntimeObject, _aDate: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'plusDays': (_self: RuntimeObject, _days: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'plusMonths': (_self: RuntimeObject, _months: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'plusYears': (_self: RuntimeObject, _years: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'isLeapYear': (_self: RuntimeObject, ) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'initialize': (_self: RuntimeObject, _day: RuntimeObject, _month: RuntimeObject, _year: RuntimeObject) =>
          (_evaluation: Evaluation) => {
            /* TODO:*/
            throw new ReferenceError('To be implemented')
          },
        'day': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'dayOfWeek': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'month': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'year': (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        '-': (_self: RuntimeObject, _aDate: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'minusDays': (_self: RuntimeObject, _days: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'minusMonths': (_self: RuntimeObject, _months: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        'minusYears': (_self: RuntimeObject, _years: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        '<': (_self: RuntimeObject, _aDate: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        '>': (_self: RuntimeObject, _aDate: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
      },

      console: {
        println: (_self: RuntimeObject, _obj: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        readLine: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        readInt: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
        newline: (_self: RuntimeObject) => (_evaluation: Evaluation) => {
          /* TODO:*/ throw new ReferenceError('To be implemented')
        },
      },
    },
  },
}