import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import Swipe from './src/Swipe';
import ErrorBoundary from './src/ErrorBoundary';
import { Card, Button} from 'react-native-elements';
import shorts from './data/shorts_data.js';

export default class App extends React.Component {

  state = {
    likedJobs: 0,
    passedJobs: 0
  };

  handleLikedJob = () => {
      this.setState(({ likedJobs }) => ({
        likedJobs: likedJobs + 1
      }));
    };

    handlePassedJob = () => {
      this.setState(({ passedJobs }) => ({
        passedJobs: passedJobs + 1
      }));
    };

  renderCards(short) {
    return (
    <ErrorBoundary>
      <Card title={short.title} titleStyle={{ fontSize: 14 }}>
        <View style={{ height: 200 }}>
          <Image
            source={require('./assets/icon.png')}
            style={{ width: '100%', height: 200 }}
          />
        </View>
        <View style={styles.detailWrapper}>
          <Text>{short.content}</Text>
        </View>
        <Text numberOfLines={4}>
          {short.content}
        </Text>
      </Card>
      </ErrorBoundary>
    );
  }

  renderNoMoreCards = () => {
    return (
      <Card title="No More cards">
        <Button
          title="Do something"
          large
          icon={{ name: 'my-location' }}
          backgroundColor="#03A9F4"
        />
      </Card>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusStyle}>
          <Text style={{ color: 'red' }}>Passed: {this.state.passedJobs}</Text>
          <Text style={{ color: 'blue' }}>Like: {this.state.likedJobs}</Text>
        </View>
        <Swipe
          data={shorts}
          renderCard={this.renderCards}
          renderNoMoreCards={this.renderNoMoreCards}
          onSwipeRight={this.handleLikedJob}
          onSwipeLeft={this.handlePassedJob}
          keyProp="key"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  statusStyle: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
});
