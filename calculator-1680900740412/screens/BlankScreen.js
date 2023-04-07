import React from 'react';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as chart from '../custom-files/chart';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import { Button, NumberInput, ScreenContainer, withTheme } from '@draftbit/ui';
import { Text, View, useWindowDimensions } from 'react-native';

const BlankScreen = props => {
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;

  const displayROI = async tax => {
    // Type the code for the body of your function or hook here.
    // Functions can be triggered via Button/Touchable actions.
    // Hooks are run per ReactJS rules.

    /* String line breaks are accomplished with backticks ( example: `line one
line two` ) and will not work with special characters inside of quotes ( example: "line one line two" ) */

    let returnValue = {
      nyc: {
        year: tax[2] - tax[0],
        day: ((tax[2] - tax[0]) / 260).toFixed(2),
        roi: ((tax[2] - tax[0]) / 270).toFixed(1),
      },
      nys: {
        year: tax[1] - tax[0],
        day: ((tax[1] - tax[0]) / 260).toFixed(2),
        roi: ((tax[1] - tax[0]) / 270).toFixed(1),
      },
    };

    return returnValue;
  };

  const calculateTax = async income => {
    // Type the code for the body of your function or hook here.
    // Functions can be triggered via Button/Touchable actions.
    // Hooks are run per ReactJS rules.

    /* String line breaks are accomplished with backticks ( example: `line one
line two` ) and will not work with special characters inside of quotes ( example: "line one line two" ) */

    function calculateTax(income, state) {
      let tax = 0;
      let stateTaxRate = tax_rate[state];
      let prevBracket = 0;

      for (let bracket in stateTaxRate) {
        if (income <= bracket) {
          tax += (income - prevBracket) * stateTaxRate[bracket];
          break;
        } else {
          tax += (bracket - prevBracket) * stateTaxRate[bracket];
          prevBracket = bracket;
        }
      }
      return parseInt(tax.toFixed(2));
    }

    let tax_rate = {
      nj: {
        20000: 0.014,
        35000: 0.0175,
        40000: 0.035,
        75000: 0.05525,
        500000: 0.0637,
        5000000: 0.0897,
        999999999: 0.1075,
      },
      ny_state: {
        8500: 0.04,
        11700: 0.045,
        13900: 0.0525,
        80650: 0.0585,
        215400: 0.0625,
        1077550: 0.0685,
        5000000: 0.0965,
        25000000: 0.103,
        999999999: 0.109,
      },
      ny_city: {
        12000: 0.03078,
        25000: 0.03762,
        50000: 0.03819,
        999999999: 0.03867,
      },
    };

    //let income = $state.textInput.value;
    let total_tax = [];

    total_tax[0] = calculateTax(income, 'nj');
    total_tax[1] = calculateTax(income, 'ny_state');
    total_tax[2] = calculateTax(income, 'ny_city') + total_tax[1];

    return total_tax;
  };

  const { theme } = props;

  const [income, setIncome] = React.useState('');
  const [numberInputValue, setNumberInputValue] = React.useState(undefined);
  const [tax_by_state, setTax_by_state] = React.useState([]);
  const [tax_roi, setTax_roi] = React.useState({
    nyc: { day: '', roi: '', year: '' },
    nys: { day: '', roi: '', year: '' },
  });

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={false}
      hasTopSafeArea={true}
    >
      <View
        style={StyleSheet.applyWidth(
          { flexDirection: 'row' },
          dimensions.width
        )}
      >
        <NumberInput
          onChangeText={newNumberInputValue => {
            const numberInputValue = newNumberInputValue;
            try {
              setIncome(newNumberInputValue);
            } catch (err) {
              console.error(err);
            }
          }}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.NumberInputStyles(theme)['Number Input'],
              {
                borderBottomWidth: 2,
                borderLeftWidth: 0,
                borderRadius: 0,
                borderRightWidth: 0,
                borderTopWidth: 0,
                marginBottom: '5%',
                marginLeft: '10%',
                marginRight: '10%',
                marginTop: '5%',
                paddingTop: 0,
              }
            ),
            dimensions.width
          )}
          editable={true}
          value={numberInputValue}
          placeholder={'Enter income'}
        />
        <Button
          onPress={() => {
            const handler = async () => {
              try {
                Utils.showAlert({
                  title: 'Disclaimer',
                  message:
                    'This is not tax or legal advice. This is a simple demonstration based on single filing status, with no deductions taken into account. Please speak with a professional accountant or lawyer to get actual tax and legal advice.',
                  buttonText: 'I agree',
                });
                const tax_result = await calculateTax(income);
                setTax_by_state(tax_result);
                const roi = await displayROI(tax_result);
                setTax_roi(roi);
              } catch (err) {
                console.error(err);
              }
            };
            handler();
          }}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.ButtonStyles(theme)['Button'], {
              backgroundColor: theme.colors['Primary'],
              marginLeft: '5%',
              marginRight: '5%',
              marginTop: '2.5%',
              position: 'absolute',
              right: '5%',
            }),
            dimensions.width
          )}
          title={'Calculate'}
        />
      </View>

      <View
        style={StyleSheet.applyWidth(
          { marginLeft: '10%', marginRight: '10%' },
          dimensions.width
        )}
      >
        <Utils.CustomCodeErrorBoundary>
          <chart.BarChartComponent tax_data={tax_by_state} />
        </Utils.CustomCodeErrorBoundary>
      </View>

      <Text
        style={StyleSheet.applyWidth(
          StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
            fontFamily: 'Poppins_400Regular',
            fontSize: 22,
            marginBottom: '2%',
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: '2%',
          }),
          dimensions.width
        )}
      >
        {'By having income taxed in'}
      </Text>

      <View>
        <Text
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
              fontFamily: 'Poppins_400Regular',
              fontSize: 18,
              marginBottom: '1%',
              marginLeft: '7%',
              marginTop: '1%',
            }),
            dimensions.width
          )}
        >
          {'NJ instead of NYC'}
        </Text>

        <View
          style={StyleSheet.applyWidth({ marginLeft: '10%' }, dimensions.width)}
        >
          <Text
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
                color: theme.colors['Primary'],
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 20,
                marginBottom: '1%',
              }),
              dimensions.width
            )}
          >
            {tax_roi?.nyc.roi}
            {'x ROI with Sarmiza'}
          </Text>
          <>
            {!tax_roi ? null : (
              <Text
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
                    fontSize: 16,
                    marginBottom: '1%',
                  }),
                  dimensions.width
                )}
              >
                {'Savings per year: $'}
                {tax_roi && tax_roi['nyc']['year']}
              </Text>
            )}
          </>
          <Text
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
                fontSize: 16,
                marginBottom: '1%',
              }),
              dimensions.width
            )}
          >
            {'Per work day: $'}
            {tax_roi?.nyc.day}
          </Text>
        </View>
      </View>

      <View>
        <Text
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
              fontFamily: 'Poppins_400Regular',
              fontSize: 18,
              marginBottom: '1%',
              marginLeft: '7%',
              marginTop: '1%',
            }),
            dimensions.width
          )}
        >
          {'NJ instead of NY State'}
        </Text>

        <View
          style={StyleSheet.applyWidth({ marginLeft: '10%' }, dimensions.width)}
        >
          <Text
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
                color: theme.colors['Primary'],
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 20,
                marginTop: '1%',
              }),
              dimensions.width
            )}
          >
            {tax_roi?.nys.roi}
            {'x ROI with Sarmiza'}
          </Text>

          <Text
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
                fontSize: 16,
                marginTop: '1%',
              }),
              dimensions.width
            )}
          >
            {'Savings per year: $'}
            {tax_roi?.nys.year}
          </Text>

          <Text
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
                fontSize: 16,
                marginTop: '1%',
              }),
              dimensions.width
            )}
          >
            {'Per work day: $'}
            {tax_roi?.nys.day}
          </Text>
        </View>
      </View>

      <Text
        style={StyleSheet.applyWidth(
          StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
            color: theme.colors['Light'],
            fontSize: 12,
            marginBottom: '2%',
            marginLeft: '10%',
            marginRight: '10%',
            marginTop: '2%',
          }),
          dimensions.width
        )}
      >
        {
          'Assuming 52*5=260 days worked, ROI is calculated based on the price of Sarmiza yearly plan vs potential savings, all figures are only for illustrative purposes'
        }
      </Text>
    </ScreenContainer>
  );
};

export default withTheme(BlankScreen);
