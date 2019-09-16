import React, { Component } from 'react';
import { View, Text, Image,PanResponder,Animated,Dimensions } from 'react-native';
import { Card } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Swipe extends Component {

    static defaultProps = {
    onSwipeUp: () => {},
    onSwipeDown: () => {},
    keyProp: 'id'
  };

    constructor(props) {
        super(props);
        this.state = { index: 0 };
        this.animated = new Animated.Value(0);

         this.panResponder = PanResponder.create({
             onStartShouldSetPanResponder: (evt, gestureState) => true,

             onPanResponderMove: (e, gestureState) => {
                 const { dy } = gestureState;
                 if(dy < 0) {
                     this.animated.setValue(dy);
                 }
             },

             onPanResponderRelease: (e, gestureState) => {
                 const { dy } = gestureState;

                 if(dy < -100) { // Swipe up away
                     Animated.timing(this.animated, {
                         toValue: -400,
                         duration: 150
                     }).start();
                     this.props.hideModal();
                     this.doSomething();
                 } else if(dy > -100 && dy < 0) { // Swipe back to initial position
                     Animated.timing(this.animated, {
                         toValue: 0,
                         duration: 150
                     }).start();
                 }
             }
         })
      }

    forceSwipe(direction) {
        const x = direction === 'up' ? SCREEN_WIDTH  : -SCREEN_WIDTH;
        Animated.timing(this.position, {
          toValue: { x, y: 0 },
          duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
      }

    onSwipeComplete(direction) {
        const { onSwipeUp, onSwipeDown, data } = this.props;
        const item = data[this.state.index];

        direction === 'up' ? onSwipeUp(item) : onSwipeDown(item);
        this.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
      }

  resetPosition() {
      Animated.spring(this.position, {
        toValue: { x: 0, y: 0 }
      }).start();
    }

  renderCardItem = (item) => {
     if (!this.props.data.length) {
        return this.props.renderNoMoreCards();
     }
     return (
        <View key={item.key} {...this._panResponder.panHandlers}>

          {this.props.renderCard(item)}
        </View>
      );
    };

    renderCards = () => {
      if (this.state.index >= this.props.data.length) {
        return this.props.renderNoMoreCards();
      }

      return this.props.data.map((item, i) => {
        if (i < this.state.index) { return null; }

        if (i === this.state.index) {
          return (
            <Animated.View
              key={item[this.props.keyProp]}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...this._panResponder.panHandlers}
            >
              {this.props.renderCard(item)}
            </Animated.View>
          );
        }

        return (
          <View
            key={item[this.props.keyProp]}
          >
            {this.props.renderCard(item)}
          </View>
        );
      }).reverse();

   };

   componentDidUpdate(prevProps, prevState, snapshot) {
       if (prevProps.data !== this.props.data) {
         this.setState({
           index: 0
         })
       }
     }


     componentWillMount() {

     }

  getCardStyle() {
      const { position } = this;
      const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
        outputRange: ['-120deg', '0deg', '120deg']
      });

      return {
        ...position.getLayout(),
        transform: [{ rotate }]
      };
    }

  render() {
    return <View>{this.renderCards()}</View>;
  }

}

const styles = {
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  cardStyle: {
      position: 'absolute',
      width: SCREEN_WIDTH
    }
};

export default Swipe;