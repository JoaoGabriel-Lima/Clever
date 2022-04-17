/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";

const InputStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin-bottom: 0.95rem;
`;

const Input = (props) => {
  return (
    <InputStyle>
      <h4 className="text-white/90 font-medium text-sm">{props.title}</h4>
      <input
        required={props.required}
        value={props.value}
        onChange={props.onChange}
        minLength={props.minLength}
        placeholder={props.placeholder}
        type={props.type}
        disabled={props.disabled}
        className="bg-[#51516c]/40 w-full py-3 px-4 rounded-md mt-2 text-white focus:outline-none focus:shadow-outline"
      ></input>
      {props.requirement && (
        <p className="text-slate-300/70 text-xs mt-2 ml-1">
          {props.requirement}
        </p>
      )}
    </InputStyle>
  );
};
export default Input;
