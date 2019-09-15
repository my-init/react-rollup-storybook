import React from 'react';
import PropTypes from 'prop-types';
import './Msg.scss';

export interface MsgProps {
  /**
   * msg you want to display
   */
  msg: string;
  /**
   * if set, will show '————' and tail
   */
  tail?: string;
}

/**
 * Just a Msg Component for demo.
 */
export const Msg: React.FC<MsgProps> = ({ msg, tail }) => {
  return (
    <div className="Msg">
      {msg}
      {tail && (
        <p style={{ color: '#cfcfcf', textAlign: 'right' }}>
          <i>{`———— ${tail}`}</i>
        </p>
      )}
    </div>
  );
};

Msg.propTypes = {
  msg: PropTypes.string.isRequired,
  tail: PropTypes.string,
};

export default Msg;
