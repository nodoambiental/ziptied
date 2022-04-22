/**
 * TODO
 *
 *
 *
 *
 *
 *
 * @module
 * @category Basic Reactive Blocks
 */

import { BehaviorSubject, Observer, Subject, Subscription, map } from "rxjs"
import type {
  DirectlyEditableHTMLProps,
  IntendedAny,
  NodeAction,
  NodeActionRef,
  OnErrorHandler,
  OnLifecycleHandler,
  Transform
} from "./types"
import { Nodes } from "./actions"
/**
 * TODO  -- Description placeholder
 * @date 4/19/2022 - 12:17:51 PM
 * @author Ágata Ordano
 *
 * @export
 * @class EditableNode
 * @typedef {EditableNode}
 * @template EditableHTMLProp extends HTMLElement[DirectlyEditableHTMLProps]
 * @category Reactive Elements
 */
export class EditableNode<EditableHTMLProp extends HTMLElement[DirectlyEditableHTMLProps]> {
  /**
   * Creates an instance of EditableNode.
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @constructor
   * @param {EditableHTMLProp} initialState
   * @param {string} id
   */
  constructor(public readonly initialState: EditableHTMLProp, public id: string) {
    this._subscriptions = {}
    this._transforms = {}
    this.initialState = initialState
    this._state = new BehaviorSubject<EditableHTMLProp>(initialState)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {Record<string, Subscription>}
   */
  protected _subscriptions: Record<string, Subscription>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {BehaviorSubject<EditableHTMLProp>}
   */
  protected _state: BehaviorSubject<EditableHTMLProp>

  /**
     * TODO  -- Description placeholder
     * @date 4/19/2022 - 12:17:51 PM
     * @author Ágata Ordano
     *
     * @protected
     * @type {(Record<
            string,
            Transform<EditableHTMLProp> | undefined
        >)}
     */
  protected _transforms: Record<string, Transform<EditableHTMLProp> | undefined>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @param {DirectlyEditableHTMLProps} nodeProperty
   * @param {Transform<EditableHTMLProp>} [transform=(data) => data]
   * @param {?Observer<EditableHTMLProp>["error"]} [onError]
   * @param {?Observer<EditableHTMLProp>["complete"]} [onLifecycle]
   */
  protected _setDirectPropertyObserver(
    nodeProperty: DirectlyEditableHTMLProps,
    transform: Transform<EditableHTMLProp> = (data) => data,
    onError?: Observer<EditableHTMLProp>["error"],
    onLifecycle?: Observer<EditableHTMLProp>["complete"]
  ): void {
    this._subscriptions[nodeProperty] = this._state.subscribe({
      next: (data) => {
        Object.defineProperty(document.getElementById(this.id), nodeProperty, {
          value: transform(data)
        })
      },
      error: onError ? onError : undefined,
      complete: onLifecycle ? onLifecycle : undefined
    })
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @param {DirectlyEditableHTMLProps} nodeProperty
   */
  protected _unsetDirectPropertyObserver(nodeProperty: DirectlyEditableHTMLProps): void {
    if (!this._subscriptions[nodeProperty]) {
      return
    }
    this._subscriptions[nodeProperty].unsubscribe()
    return
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {DirectlyEditableHTMLProps} property
   * @param {?Transform<EditableHTMLProp>} [transform]
   * @param {?Observer<EditableHTMLProp>["error"]} [onError]
   * @param {?Observer<EditableHTMLProp>["complete"]} [onLifecycle]
   */
  public setProperty(
    property: DirectlyEditableHTMLProps,
    transform?: Transform<EditableHTMLProp>,
    onError?: Observer<EditableHTMLProp>["error"],
    onLifecycle?: Observer<EditableHTMLProp>["complete"]
  ): void {
    this._transforms[property] = transform
    this._setDirectPropertyObserver(property, transform, onError, onLifecycle)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {DirectlyEditableHTMLProps} property
   */
  public unsetProperty(property: DirectlyEditableHTMLProps): void {
    this._unsetDirectPropertyObserver(property)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {EditableHTMLProp} value
   */
  public update(value: EditableHTMLProp): void {
    this._state.next(value)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {Partial<Observer<EditableHTMLProp>>} observer
   * @returns {Subscription}
   */
  public sideEffect(observer: Partial<Observer<EditableHTMLProp>>): Subscription {
    return this._state.subscribe(observer)
  }
}

/**
 * TODO  -- Description placeholder
 * @date 4/19/2022 - 12:17:51 PM
 * @author Ágata Ordano
 *
 * @export
 * @class State
 * @typedef {State}
 * @template Data
 * @category Reactive Data Handling
 */
export class State<Data> {
  /**
   * Creates an instance of State.
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @constructor
   * @param {Data} initialState
   */
  constructor(public readonly initialState: Data) {
    this.initialState = initialState
    this._state = new BehaviorSubject<Data>(initialState)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {BehaviorSubject<Data>}
   */
  protected _state: BehaviorSubject<Data>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {Data} value
   */
  public update(value: Data): void {
    this._state.next(value)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {Partial<Observer<Data>>} observer
   * @returns {Subscription}
   */
  public subscribe(observer: Partial<Observer<Data>>): Subscription {
    return this._state.subscribe(observer)
  }
}

/**
 * TODO  -- Description placeholder
 * @date 4/19/2022 - 12:17:51 PM
 * @author Ágata Ordano
 *
 * @export
 * @class Node
 * @typedef {Node}
 * @category Reactive Elements
 */
export class Node {
  /**
   * Creates an instance of Node.
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @constructor
   * @param {string} id
   * @param {?Observer<HTMLElement>["error"]} [onError]
   * @param {?Observer<HTMLElement>["complete"]} [onLifecycle]
   * @param {?boolean} [isComponent]
   */
  constructor(
    protected id: string,
    onError?: Observer<HTMLElement>["error"],
    onLifecycle?: Observer<HTMLElement>["complete"],
    isComponent?: boolean
  ) {
    // TODO handle the state initialization
    this._isComponent = isComponent ?? false
    if (this._isComponent) {
      this._nodeElement = () => {
        const element = document.querySelector(`[data-zt-id="${id}"]`) as HTMLElement | null
        if (!element) {
          throw new Error("No elements found; can't add reactivity to a node that does not exist.")
        } else {
          return element
        }
      }
    } else {
      this._nodeElement = () => {
        const element = document.getElementById(id)
        if (!element) {
          throw new Error("No elements found; can't add reactivity to a node that does not exist.")
        } else {
          return element
        }
      }
    }
    this._node = new BehaviorSubject(this._nodeElement())
    this._nodeSubscription = this._node.subscribe({
      next: (node) => {
        this._nodeElement().replaceWith(node)
      },
      error: onError ? onError : undefined,
      complete: onLifecycle ? onLifecycle : undefined
    })
    this._action = new BehaviorSubject({ id: "" })
    this._actions = {}
    this._actionSubscriptions = {}

    const defaultActionKeys: (keyof typeof Nodes)[] = Object.keys(
      Nodes
    ) as unknown as (keyof typeof Nodes)[]
    defaultActionKeys.forEach((actionKey) => {
      this.addAction(actionKey, Nodes[actionKey])
    })
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {boolean}
   */
  protected _isComponent: boolean

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {() => HTMLElement}
   */
  protected _nodeElement: () => HTMLElement

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {Subscription}
   */
  protected _nodeSubscription: Subscription

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {Record<string, Subscription>}
   */
  protected _actionSubscriptions: Record<string, Subscription>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {BehaviorSubject<HTMLElement>}
   */
  protected _node: BehaviorSubject<HTMLElement>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {BehaviorSubject<NodeActionRef<IntendedAny>>}
   */
  protected _action: BehaviorSubject<NodeActionRef<IntendedAny>>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {Record<string, NodeAction<IntendedAny>>}
   */
  protected _actions: Record<string, NodeAction<IntendedAny>>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {string} actionId
   * @param {NodeAction<IntendedAny>} action
   * @param {?OnErrorHandler} [onError]
   * @param {?OnLifecycleHandler} [onLifecycle]
   */
  public addAction(
    actionId: string,
    action: NodeAction<IntendedAny>,
    onError?: OnErrorHandler,
    onLifecycle?: OnLifecycleHandler
  ) {
    this._actions[actionId] = action
    this._actionSubscriptions[actionId] = this._action.subscribe({
      next: (data) => {
        if (data.id === actionId) {
          this._node.next(action(this._nodeElement(), data.payload))
        }
        return data
      },
      error: onError,
      complete: onLifecycle
    })
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {string} actionId
   */
  public removeAction(actionId: string) {
    this._actionSubscriptions[actionId].unsubscribe()
    delete this._actions[actionId]
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {string} actionId
   * @param {?*} [payload]
   */
  public fireAction(actionId: string, payload?: IntendedAny) {
    this._action.next({ id: actionId, payload: payload })
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @readonly
   * @type {*}
   */
  public get actionsList() {
    return Object.keys(this._actions)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {Partial<Observer<HTMLElement>>} observer
   * @returns {Subscription}
   */
  public sideEffect(observer: Partial<Observer<HTMLElement>>): Subscription {
    return this._node.subscribe(observer)
  }
}

/**
 * TODO  -- Description placeholder
 * @date 4/19/2022 - 12:17:51 PM
 * @author Ágata Ordano
 *
 * @export
 * @class StatefulNode
 * @typedef {StatefulNode}
 * @extends {Node}
 * @category Reactive Elements
 */
export class StatefulNode extends Node {
  /**
   * Creates an instance of StatefulNode.
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @constructor
   * @param {string} id
   * @param {*} initialState
   * @param {?Observer<HTMLElement>["error"]} [onError]
   * @param {?Observer<HTMLElement>["complete"]} [onLifecycle]
   * @param {?boolean} [isComponent]
   */
  constructor(
    protected id: string,
    initialState: IntendedAny,
    onError?: Observer<HTMLElement>["error"],
    onLifecycle?: Observer<HTMLElement>["complete"],
    isComponent?: boolean
  ) {
    super(id, onError, onLifecycle, isComponent)

    this._states = {}
    this._stateValues = {}
    this._states["default"] = new State(initialState)
    this._states["default"].subscribe({
      next: (value) => (this._stateValues["default"] = value)
    })
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {Record<string, State<IntendedAny>>}
   */
  protected _states: Record<string, State<IntendedAny>>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {Record<string, IntendedAny>}
   */
  protected _stateValues: Record<string, IntendedAny>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {?string} [stateKey]
   * @returns {*}
   */
  public getState(stateKey?: string): IntendedAny {
    return this._stateValues[stateKey ?? "default"]
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {?string} [stateKey]
   * @returns {State<IntendedAny>}
   */
  public getStateObject(stateKey?: string): State<IntendedAny> {
    return this._states[stateKey ?? "default"]
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {unknown} newState
   * @param {?string} [stateKey]
   */
  public setState(newState: unknown, stateKey?: string): void {
    // console.log(
    //     `Setting state for node ${this.id}, key ${stateKey}, with the data ${newState}`
    // );
    if (this._states[stateKey ?? "default"]) {
      this._states[stateKey ?? "default"].update(newState)
    } else {
      this._states[stateKey ?? "default"] = new State(newState)
      this._states[stateKey ?? "default"].subscribe({
        next: (value) => (this._stateValues[stateKey ?? "default"] = value)
      })
    }
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {Transform<unknown>} transform
   * @param {?string} [stateKey]
   */
  public transformState(transform: Transform<unknown>, stateKey?: string): void {
    this._states[stateKey ?? "default"].update(transform(this._stateValues[stateKey ?? "default"]))
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {NodeAction<IntendedAny>} action
   * @param {?string} [stateKey]
   * @returns {Subscription}
   */
  public sideEffectStateful(action: NodeAction<IntendedAny>, stateKey?: string): Subscription {
    return this._states[stateKey ?? "default"].subscribe({
      next: (state) => {
        action(this._nodeElement(), state)
      }
    })
  }
}

/**
 * TODO  -- Description placeholder
 * @date 4/19/2022 - 12:17:51 PM
 * @author Ágata Ordano
 *
 * @export
 * @class Stream
 * @typedef {Stream}
 * @template Data
 * @category Reactive Data Handling
 */
export class Stream<Data> {
  /**
   * Creates an instance of Stream.
   * @date 4/19/2022 - 12:17:51 PM
   * @author Ágata Ordano
   *
   * @constructor
   */
  constructor() {
    this._state = new Subject<Data>()
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:50 PM
   * @author Ágata Ordano
   *
   * @protected
   * @type {Subject<Data>}
   */
  protected _state: Subject<Data>

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:50 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {(data: unknown) => Data} transform
   * @param {Observer<Data>} observer
   * @returns {Subscription}
   */
  public subscribe(transform: (data: unknown) => Data, observer: Observer<Data>): Subscription {
    return this._state.pipe(map(transform)).subscribe(observer)
  }

  /**
   * TODO  -- Description placeholder
   * @date 4/19/2022 - 12:17:50 PM
   * @author Ágata Ordano
   *
   * @public
   * @param {Data} value
   */
  public add(value: Data): void {
    this._state.next(value)
  }
}

// TODO fix the typings of window and shit
// TODO clean, fix and extend this properly
// TODO make a more decent startup script
