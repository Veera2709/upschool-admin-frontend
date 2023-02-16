import React, { useMemo } from "react";
import React2, { useEffect, useMemo as useMemo2, useState, useCallback } from "react";
import React3, { useCallback as useCallback2, useEffect as useEffect2, useMemo as useMemo3, useState as useState2 } from "react";
import React4, { useEffect as useEffect3, useMemo as useMemo4, useState as useState3 } from "react";



var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/DeviceFrameset.tsx

// src/DeviceOptions.ts
var defineDevice = (definition) => definition;
var DeviceOptions = {
  ["iPhone X"]: defineDevice({
    device: "iphone-x",
    colors: [],
    hasLandscape: true,
    width: 375,
    height: 812
  }),
  ["iPhone 8"]: defineDevice({
    device: "iphone8",
    colors: ["black", "silver", "gold"],
    hasLandscape: true,
    width: 375,
    height: 667
  }),
  ["iPhone 8 Plus"]: defineDevice({
    device: "iphone8plus",
    colors: ["black", "silver", "gold"],
    hasLandscape: true,
    width: 414,
    height: 736
  }),
  ["iPhone 5s"]: defineDevice({
    device: "iphone5s",
    colors: ["black", "silver", "gold"],
    hasLandscape: true,
    width: 320,
    height: 568
  }),
  ["iPhone 5c"]: defineDevice({
    device: "iphone5c",
    colors: ["white", "red", "yellow", "green", "blue"],
    hasLandscape: true,
    width: 320,
    height: 568
  }),
  ["iPhone 4s"]: defineDevice({
    device: "iphone4s",
    colors: ["black", "silver"],
    hasLandscape: true,
    width: 320,
    height: 480
  }),
  ["Galaxy Note 8"]: defineDevice({
    device: "note8",
    colors: [],
    hasLandscape: true,
    width: 400,
    height: 822
  }),
  ["Nexus 5"]: defineDevice({
    device: "nexus5",
    colors: [],
    hasLandscape: true,
    width: 320,
    height: 568
  }),
  ["Lumia 920"]: defineDevice({
    device: "lumia920",
    colors: ["black", "white", "yellow", "red", "blue"],
    hasLandscape: true,
    width: 320,
    height: 533
  }),
  ["Samsung Galaxy S5"]: defineDevice({
    device: "s5",
    colors: ["white", "black"],
    hasLandscape: true,
    width: 320,
    height: 568
  }),
  ["HTC One"]: defineDevice({
    device: "nexus5",
    colors: [],
    hasLandscape: true,
    width: 320,
    height: 568
  }),
  ["iPad Mini"]: defineDevice({
    device: "ipad",
    colors: ["black", "silver"],
    hasLandscape: true,
    width: 576,
    height: 768
  }),
  ["MacBook Pro"]: defineDevice({
    device: "macbook",
    colors: [],
    hasLandscape: false,
    width: 960,
    height: 600
  })
};
var DeviceNames = Object.keys(DeviceOptions);

// src/DeviceFrameset.tsx
function omit(item, keys) {
  const clone = __spreadValues({}, item);
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
}
var DeviceFrameset = React.memo(function DeviceFrameset2(props) {
  const _a = props, { children, device, width, height, zoom } = _a, restProps = __objRest(_a, ["children", "device", "width", "height", "zoom"]);
  const divProps = omit(restProps, ["landscape", "color"]);
  const color = "color" in props ? props.color : void 0;
  const landscape = "landscape" in props ? props.landscape : void 0;
  const style = useMemo(() => landscape && DeviceOptions[device].hasLandscape ? { width: height, height: width, transform: zoom !== void 0 ? `scale(${zoom})` : void 0 } : { width, height, transform: zoom !== void 0 ? `scale(${zoom})` : void 0 }, [width, height, landscape, device, zoom]);
  return /* @__PURE__ */ React.createElement("div", __spreadProps(__spreadValues({
    className: `marvel-device ${DeviceOptions[device].device} ${color ? color : ""} ${landscape ? "landscape" : ""}`
  }, divProps), {
    style
  }), /* @__PURE__ */ React.createElement("div", {
    className: "inner"
  }), device === "Galaxy Note 8" ? /* @__PURE__ */ React.createElement("div", {
    className: "overflow"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "shadow"
  })) : null, device === "iPhone X" ? /* @__PURE__ */ React.createElement("div", {
    className: "notch"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "camera"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "speaker"
  })) : null, /* @__PURE__ */ React.createElement("div", {
    className: "top-bar"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "sleep"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "bottom-bar"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "volume"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "camera"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "sensor"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "speaker"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "sensors"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "more-sensors"
  }), device === "iPhone X" ? /* @__PURE__ */ React.createElement("div", {
    className: "overflow"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "shadow shadow--tr"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "shadow shadow--tl"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "shadow shadow--br"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "shadow shadow--bl"
  })) : null, /* @__PURE__ */ React.createElement("div", {
    className: "inner-shadow"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "screen"
  }, children), /* @__PURE__ */ React.createElement("div", {
    className: "home"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "bottom-bar"
  }));
});

// src/DeviceSelector.tsx
var DeviceSelector = React2.memo(function DeviceSelector2(_a) {
  var _b = _a, { children, value, onChange, banDevices = [] } = _b, divProps = __objRest(_b, ["children", "value", "onChange", "banDevices"]);
  var _a2;
  const deviceNames = useMemo2(() => DeviceNames.filter((devName) => !banDevices.includes(devName)), [banDevices]);
  const [deviceName, setDeviceName] = useState((_a2 = deviceNames[0]) != null ? _a2 : "");
  const selectedDeviceName = useMemo2(() => value != null ? value : deviceName, [value, deviceName]);
  const handleSelectChange = useCallback((event) => {
    const newDeviceName = event.currentTarget.dataset["deviceName"];
    if (!deviceNames.includes(newDeviceName))
      throw new Error(`Invalid device name for ${newDeviceName}`);
    onChange == null ? void 0 : onChange(newDeviceName);
    setDeviceName(newDeviceName);
  }, [deviceNames, onChange]);
  const [showMenu, setShowMenu] = useState(true);
  const { colors, hasLandscape, width, height } = useMemo2(() => DeviceOptions[selectedDeviceName], [selectedDeviceName]);
  const firstColor = useMemo2(() => colors[0], [colors]);
  const [selectedColor, setSelectedColor] = useState(firstColor);
  const handleColorChange = useCallback((event) => {
    const newDeviceColor = event.currentTarget.dataset["deviceColor"];
    setSelectedColor(newDeviceColor);
  }, []);
  useEffect(() => {
    setSelectedColor(firstColor);
  }, [firstColor]);
  const [isLandscape, setIsLandscape] = useState(void 0);
  const isLandscapeChecked = useMemo2(() => hasLandscape ? isLandscape : void 0, [hasLandscape, isLandscape]);
  const handleIsLandscapeChange = useCallback(() => {
    if (!hasLandscape)
      return;
    setIsLandscape((is) => !is);
  }, [hasLandscape]);
  const deviceFramesetProps = useMemo2(() => ({
    device: selectedDeviceName,
    color: selectedColor,
    landscape: isLandscapeChecked,
    width,
    height
  }), [selectedDeviceName, selectedColor, isLandscapeChecked, width, height]);
  return /* @__PURE__ */ React2.createElement("div", __spreadValues({
    className: "device-selector"
  }, divProps), /* @__PURE__ */ React2.createElement("dl", null, /* @__PURE__ */ React2.createElement("dt", null, /* @__PURE__ */ React2.createElement("p", null, "The Chosen: ", selectedDeviceName), /* @__PURE__ */ React2.createElement("span", {
    className: showMenu ? "active" : "",
    onClick: () => setShowMenu((is) => !is)
  }, "show all devices")), showMenu && deviceNames.map((devName) => /* @__PURE__ */ React2.createElement("dd", {
    key: devName,
    "data-device-name": devName,
    onClick: handleSelectChange,
    className: devName === selectedDeviceName ? "active" : ""
  }, /* @__PURE__ */ React2.createElement("input", {
    type: "radio",
    id: devName
  }), /* @__PURE__ */ React2.createElement("label", {
    htmlFor: devName
  }, /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("p", null, devName), DeviceOptions[devName].hasLandscape && /* @__PURE__ */ React2.createElement("span", {
    className: devName === deviceName && isLandscape ? "active" : "",
    onClick: handleIsLandscapeChange
  }, "landscape")), /* @__PURE__ */ React2.createElement("ul", null, DeviceOptions[devName].colors.map((color) => /* @__PURE__ */ React2.createElement("li", {
    key: color,
    title: color,
    "data-device-color": color,
    onClick: handleColorChange,
    className: [devName === deviceName && color === selectedColor ? "active" : "", color].join(" ")
  }))))))), /* @__PURE__ */ React2.createElement("div", {
    className: "device-selector-container"
  }, children(deviceFramesetProps)));
});

// src/DeviceEmulator.tsx
var zooms = [
  0.5,
  0.75,
  1,
  1.25,
  1.5
];
var DeviceEmulator = React3.memo(function DeviceEmulator2(_a) {
  var _b = _a, { children, value, onChange, banDevices = [] } = _b, divProps = __objRest(_b, ["children", "value", "onChange", "banDevices"]);
  var _a2;
  const deviceNames = useMemo3(() => DeviceNames.filter((devName) => !banDevices.includes(devName)), [banDevices]);
  const [deviceName, setDeviceName] = useState2((_a2 = deviceNames[0]) != null ? _a2 : "");
  const selectedDeviceName = useMemo3(() => {
    var _a3;
    return (_a3 = value == null ? void 0 : value.device) != null ? _a3 : deviceName;
  }, [value, deviceName]);
  const handleSelectChange = useCallback2((event) => {
    const newDeviceName = event.target.value;
    if (!deviceNames.includes(newDeviceName))
      throw new Error(`Invalid device name for ${newDeviceName}`);
    setDeviceName(newDeviceName);
  }, [deviceNames]);
  const [selectedZoom, setSelectedZoom] = useState2(zooms[2]);
  const handleSelectZoomChange = useCallback2((event) => {
    const newZoom = +event.target.value;
    if (!zooms.includes(newZoom))
      throw new Error(`Invalid device zoom for ${newZoom}`);
    setSelectedZoom(newZoom);
  }, []);
  const { colors, hasLandscape, width, height } = useMemo3(() => DeviceOptions[selectedDeviceName], [selectedDeviceName]);
  const firstColor = useMemo3(() => colors[0], [colors]);
  const [isLandscape, setIsLandscape] = useState2(void 0);
  const isLandscapeChecked = useMemo3(() => hasLandscape ? isLandscape : void 0, [hasLandscape, isLandscape]);
  const handleIsLandscapeChange = useCallback2(() => {
    if (!hasLandscape)
      return;
    setIsLandscape((is) => !is);
  }, [hasLandscape]);
  const deviceFramesetProps = useMemo3(() => value != null ? value : {
    device: selectedDeviceName,
    color: firstColor,
    landscape: isLandscapeChecked,
    width,
    height,
    zoom: selectedZoom
  }, [value, selectedDeviceName, firstColor, isLandscapeChecked, width, height, selectedZoom]);
  useEffect2(() => {
    onChange == null ? void 0 : onChange(deviceFramesetProps);
  }, [onChange, deviceFramesetProps]);
  return /* @__PURE__ */ React3.createElement("div", __spreadValues({
    className: "device-emulator"
  }, divProps), /* @__PURE__ */ React3.createElement("section", null, /* @__PURE__ */ React3.createElement("select", {
    value: selectedDeviceName,
    onChange: handleSelectChange
  }, deviceNames.map((devName) => /* @__PURE__ */ React3.createElement("option", {
    key: devName,
    value: devName
  }, devName))), /* @__PURE__ */ React3.createElement("input", {
    disabled: true,
    value: width
  }), /* @__PURE__ */ React3.createElement("span", null, "x"), /* @__PURE__ */ React3.createElement("input", {
    disabled: true,
    value: height
  }), /* @__PURE__ */ React3.createElement("select", {
    value: selectedZoom,
    onChange: handleSelectZoomChange
  }, zooms.map((zoom) => /* @__PURE__ */ React3.createElement("option", {
    key: zoom,
    value: zoom
  }, zoom * 100, "%"))), /* @__PURE__ */ React3.createElement("label", null, "Landscape:"), /* @__PURE__ */ React3.createElement("input", {
    type: "checkbox",
    checked: !!isLandscapeChecked,
    disabled: !hasLandscape,
    onChange: handleIsLandscapeChange
  })), /* @__PURE__ */ React3.createElement("div", {
    className: "device-emulator-container"
  }, children(deviceFramesetProps)));
});

// src/Zoomable.tsx
var steps = [
  0,
  1 / 4,
  1 / 3,
  1 / 2,
  2 / 3,
  3 / 4,
  4 / 5,
  9 / 10,
  1,
  11 / 10,
  5 / 4,
  3 / 2,
  7 / 4,
  2 / 1,
  5 / 2,
  3 / 1,
  4 / 1,
  5 / 1,
  Infinity
];
var toCurrIndex = (value) => steps.findIndex((step) => step > value) - 1;
var toPrevIndex = (value) => steps.findIndex((step) => step > value) - 2;
var toNextIndex = (value) => steps.findIndex((step) => step > value);
var checkReachBound = (value) => {
  if (value === steps[0])
    return steps[1];
  if (value === steps[steps.length - 1])
    return steps[steps.length - 2];
  return value;
};
var toCurr = (value) => {
  return checkReachBound(steps[toCurrIndex(value)]);
};
var toPrev = (value) => {
  return checkReachBound(steps[toPrevIndex(value)]);
};
var toNext = (value) => {
  return checkReachBound(steps[toNextIndex(value)]);
};
var Zoomable = React4.memo(function Zoomable2(_a) {
  var _b = _a, {
    children
  } = _b, props = __objRest(_b, [
    "children"
  ]);
  const [[width, height], setSize] = useState3([1, 1]);
  const [[clientWidth, clientHeight], setClientSize] = useState3([width, height]);
  const [container, setContainer] = useState3(null);
  const [zoomContainer, setZoomContainer] = useState3(null);
  const scale = useMemo4(() => {
    const [scaleX, scaleY] = [width / clientWidth, height / clientHeight];
    return Math.min(scaleX, scaleY, 1);
  }, [width, height, clientWidth, clientHeight]);
  const [localScale, setLocaleScale] = useState3(null);
  const realScale = useMemo4(() => toCurr(localScale != null ? localScale : scale), [localScale, scale]);
  const allowScroll = useMemo4(() => clientWidth / realScale < width || clientHeight / realScale < height, [clientHeight, clientWidth, realScale, width, height]);
  const transformStyle = useMemo4(() => {
    return { transform: `scale(${realScale})` };
  }, [realScale]);
  useEffect3(() => {
    if (zoomContainer) {
      const syncClientSize = (el) => {
        const { clientWidth: clientWidth2, clientHeight: clientHeight2 } = el;
        clientWidth2 && clientHeight2 && setClientSize([clientWidth2, clientHeight2]);
      };
      syncClientSize(zoomContainer);
      const option = {};
      const observe = (entries) => {
        for (const entry of entries) {
          syncClientSize(entry.target);
        }
      };
      const observer = new ResizeObserver(observe);
      observer.observe(zoomContainer, option);
      return () => observer.disconnect();
    }
  }, [zoomContainer]);
  useEffect3(() => {
    if (container) {
      const { clientWidth: clientWidth2, clientHeight: clientHeight2 } = container;
      setSize([clientWidth2, clientHeight2]);
    }
  }, [container]);
  return /* @__PURE__ */ React4.createElement("div", __spreadProps(__spreadValues({}, props), {
    style: __spreadProps(__spreadValues({}, props.style), { position: "relative" })
  }), /* @__PURE__ */ React4.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: allowScroll ? "auto" : "hidden"
    },
    ref: setContainer
  }, /* @__PURE__ */ React4.createElement("div", {
    ref: setZoomContainer,
    style: __spreadValues({ transformOrigin: "center" }, transformStyle)
  }, children)), /* @__PURE__ */ React4.createElement("div", {
    style: { position: "absolute", right: "16px", top: "16px" }
  }, /* @__PURE__ */ React4.createElement("span", {
    onClick: () => setLocaleScale(toPrev(realScale))
  }, "-"), Math.round(realScale * 100), "%", /* @__PURE__ */ React4.createElement("span", {
    onClick: () => setLocaleScale(toNext(realScale))
  }, "+")));
});
export {
  DeviceEmulator,
  DeviceFrameset,
  DeviceOptions,
  DeviceSelector,
  Zoomable
};
