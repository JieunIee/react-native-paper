import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { getIconButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import ActivityIndicator from '../ActivityIndicator';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon, { IconSource } from '../Icon';
import Surface from '../Surface';

const PADDING = 8;

type IconButtonMode = 'outlined' | 'contained' | 'contained-tonal';

export type Props = $RemoveChildren<typeof TouchableOpacity> & {
  /**
   * Icon to display.
   */
  icon: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Mode of the icon button. By default there is no specified mode - only a pressable icon will be rendered.
   */
  mode?: IconButtonMode;
  /**
   * @renamed Renamed from 'color' to 'iconColor' in v5.x
   * Color of the icon.
   */
  iconColor?: string;
  /**
   * Background color of the icon container.
   */
  containerColor?: string;

  /**
   * @supported Available in v5.x with theme version 3
   * Whether icon button is selected. A selected button receives alternative combination of icon and container colors.
   */
  selected?: boolean;
  /**
   * Size of the icon.
   */
  size?: number;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Whether an icon change is animated.
   */
  animated?: boolean;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Function to execute on press.s
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
};

/**
 * An icon button is a button which displays only an icon without a label.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { IconButton, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <IconButton
 *     icon="camera"
 *     iconColor={MD3Colors.error50}
 *     size={20}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 */
const IconButton = forwardRef<View, Props>(
  (
    {
      icon,
      iconColor: customIconColor,
      containerColor: customContainerColor,
      size = 24,
      accessibilityLabel,
      disabled,
      onPress,
      selected = false,
      animated = false,
      mode,
      style,
      theme: themeOverrides,
      testID = 'icon-button',
      loading = false,
      ...rest
    }: Props,
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);
    const { isV3 } = theme;

    const IconComponent = animated ? CrossFadeIcon : Icon;

    const { iconColor, backgroundColor, borderColor } = getIconButtonColor({
      theme,
      disabled,
      selected,
      mode,
      customIconColor,
      customContainerColor,
    });

    const buttonSize = isV3 ? size + 2 * PADDING : size * 1.5;

    const {
      borderWidth = isV3 && mode === 'outlined' && !selected ? 1 : 0,
      borderRadius = buttonSize / 2,
    } = (StyleSheet.flatten(style) || {}) as ViewStyle;

    const borderStyles = {
      borderWidth,
      borderRadius,
      borderColor,
    };

    return (
      <Surface
        ref={ref}
        testID={`${testID}-container`}
        style={[
          {
            backgroundColor,
            width: buttonSize,
            height: buttonSize,
          },
          styles.container,
          borderStyles,
          !isV3 && disabled && styles.disabled,
          style,
        ]}
        {...(isV3 && { elevation: 0 })}
      >
        <TouchableOpacity
          onPress={onPress}
          accessibilityLabel={accessibilityLabel}
          style={[styles.touchable, { borderRadius }]}
          accessibilityState={{ disabled }}
          accessibilityRole="button"
          disabled={disabled}
          hitSlop={{ top: 6, left: 6, bottom: 6, right: 6 }}
          testID={testID}
          {...rest}
        >
          {loading ? (
            <ActivityIndicator size={size} color={iconColor} />
          ) : (
            <IconComponent color={iconColor} source={icon} size={size} />
          )}
        </TouchableOpacity>
      </Surface>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    margin: 6,
    elevation: 0,
  },
  touchable: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.32,
  },
});

export default IconButton;
