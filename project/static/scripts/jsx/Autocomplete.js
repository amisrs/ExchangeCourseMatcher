/* eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import constants from './constants';
import Icon from './Icon';

class Autocomplete extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.value || '',
      maybeShowAll: false
    };

    this.renderIcon = this.renderIcon.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    this._onChange = this._onChange.bind(this);
    // added myself
    this._setMaybeShowAll = this._setMaybeShowAll.bind(this);
    this._hideSuggestions = this._hideSuggestions.bind(this);
  }

  componentWillReceiveProps ({ value }) {
    if (value !== undefined) {
      this.setState({ value: value });
    }

    // if (this.state.maybeShowAll === true) {
    //   this.setState({ maybeShowAll: false})
    // }
  }

  renderIcon (icon, iconClassName) {
    return <Icon className={iconClassName}>{icon}</Icon>;
  }

  renderDropdown (data, minLength, limit) {
    const { value, maybeShowAll } = this.state;

    if (minLength && minLength > value.length || (!maybeShowAll)) {
      return null;
    }

    let matches = []
    if (maybeShowAll && !value) {
      matches = Object.keys(data).filter(key => {
        const index = key.toUpperCase().indexOf(value.toUpperCase());
        return /*index !== -1 && */value.length < key.length;
      });
    } else {
      matches = Object.keys(data).filter(key => {
        const index = key.toUpperCase().indexOf(value.toUpperCase());
        return index !== -1 && value.length < key.length;
      });
    }

    if (limit) matches = matches.slice(0, limit);
    if (matches.length === 0) {
      return null;
    }

    return (
      <ul className='autocomplete-content dropdown-content'>
        {matches.map((key, idx) => {
          const index = key.toUpperCase().indexOf(value.toUpperCase());
          return (
            <li key={key + '_' + idx} onClick={this._onAutocomplete.bind(this, key)}>
              {data[key] ? <img src={data[key]} className='right circle' /> : null}
              <span>
                {index !== 0 ? key.substring(0, index) : ''}
                <span className='highlight'>{key.substring(index, index+value.length)/*value*/}</span>
                {key.length !== index + value.length ? key.substring(index + value.length) : ''}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  _onChange (evt) {
    const { onChange } = this.props;
    const value = evt.target.value;
    if (onChange) { onChange(evt, value); }

    this.setState({ value: value });
  }

  _onAutocomplete (value, evt) {
    console.log('in auto complete')
    const { onChange, onAutocomplete } = this.props;
    if (onAutocomplete) { onAutocomplete(value); }
    if (onChange) { onChange(evt, value); }

    this.setState({ value: "" });
    //this.setState({ value: value });
  }

  // added myself
  _setMaybeShowAll () {
    this.setState({ maybeShowAll: true });
  }

  _hideSuggestions () {
    setTimeout(() => {
      this.setState({ maybeShowAll: false });
    }, 100);
  }

  render () {
    const {
      className,
      title,
      data,
      icon,
      iconClassName,
      s,
      m,
      l,
      offset,
      minLength,
      placeholder,
      limit,
      // these are mentioned here only to prevent from getting into ...props
      value,
      onChange,
      onAutocomplete,
      ...props
    } = this.props;

    const _id = 'autocomplete-input';
    const sizes = { s, m, l };
    let classes = {
      col: true
    };
    constants.SIZES.forEach(size => {
      classes[size + sizes[size]] = sizes[size];
    });
    // added myself onclick
    return (
      <div
        offset={offset} className={cx('input-field', className, classes)} {...props}>
        {icon && this.renderIcon(icon, iconClassName)}
        <input
          placeholder={placeholder}
          className='autocomplete'
          id={_id}
          onChange={this._onChange}
          type='text'
          value={this.state.value}
          onFocus={this._setMaybeShowAll}
          onBlur={this._hideSuggestions}
        />
        <label htmlFor={_id}>{title}</label>
        {this.renderDropdown(data, minLength, limit)}
      </div>
    );
  }
}

Autocomplete.propTypes = {
  className: PropTypes.string,
  /*
   * The title of the autocomplete component.
   */
  title: PropTypes.string,
  /*
   * An object with the keys of the items to match in autocomplete
   * The values are either null or a location to an image
   */
  data: PropTypes.object.isRequired,
  /*
   * Optional materialize icon to add to the autocomplete bar
   */
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  offset: PropTypes.string,
  /*
   * Determine input length before dropdown
   */
  minLength: PropTypes.number,
  /**
   * The max amount of results that can be shown at once. Default: Infinity
   * */
  limit: PropTypes.number,
  /**
   * Placeholder for input element
   * */
  placeholder: PropTypes.string,
  /**
   * Called when the value of the input gets changed - by user typing or clicking on an auto-complete item.
   * Function signature: (event, value) => ()
   */
  onChange: PropTypes.func,
  /**
   * Called when auto-completed item is selected.
   * Function signature: (value) => ()
   */
  onAutocomplete: PropTypes.func,
  /**
   * The value of the input
   */
  value: PropTypes.string
};

export default Autocomplete;