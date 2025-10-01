import {
  controlFunctions,
  type ControlFunction,
  type ControlConfig,
  type ControlOption,
} from './controlFunctions'
import type { AnyCanvasElement } from '../models'

export interface RenderedControl {
  id: string
  type: 'input' | 'slider' | 'color' | 'select' | 'toggle' | 'button' | 'range'
  label: string
  icon?: string
  value: string | number | boolean
  config: ControlConfig
  options: ControlOption[]
  disabled: boolean
  onChange: (value: string | number | boolean) => void
}

// Interface removed - all elements now have control methods via abstract base class

export class ControlRenderer {
  static getElementControls(element: AnyCanvasElement): ControlFunction[] {
    // Every element now has getControlList method (abstract method)
    const controlList = element.getControlList()
    const overrides = element.getControlOverrides()

    return controlList
      .map((controlId: string) => {
        const baseControl = controlFunctions[controlId]
        if (!baseControl) {
          console.warn(`Control function '${controlId}' not found`)
          return null
        }

        // Apply element-specific overrides
        const override = overrides[controlId] || {}
        const mergedControl = { ...baseControl, ...override }

        // Check visibility
        if (mergedControl.isVisible && !mergedControl.isVisible(element)) {
          return null
        }

        return mergedControl
      })
      .filter(Boolean) as ControlFunction[]
  }

  static renderControl(control: ControlFunction, element: AnyCanvasElement): RenderedControl {
    return {
      id: control.id,
      type: control.type,
      label: control.label,
      icon: control.icon,
      value: control.getValue(element),
      config: control.getConfig?.() || {},
      options: control.getOptions?.() || [],
      disabled: control.isDisabled?.(element) || false,
      onChange: (value: string | number | boolean) => control.setValue(element, value),
    }
  }

  static renderAllControls(element: AnyCanvasElement): RenderedControl[] {
    const controls = this.getElementControls(element)
    return controls.map((control) => this.renderControl(control, element))
  }
}
