function loadJSON(callback) {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'entrance-task-3-2-master/data/input.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      try {
        let jsonOut = JSON.parse(xobj.responseText);
        callback(jsonOut);
      } catch (error) {
        console.log(error);
      }
    }
  };
  xobj.send(null);  
}

const dayStarts = 7,
    nightStarts = 21;

loadJSON(function(json) {

  let isError = false;
  if (json.rates.length < 1) {
    console.log("There is no rates information. ERROR");
    return;
  } else if (json.devices.length < 1) {
    console.log("There is no devices information. ERROR");
    return;
  } else if (((json.maxPower == undefined)||(Number(json.maxPower) < 1))) {
    console.log("There is no power information. ERROR");
    return;
  }
  
  var day = [];
  (function sortInput () {
  
    json.rates.forEach(element => {  // set hour cost to each hour in day
      
      if ((element.from == undefined)||(Number(element.from) < 0)||(Number(element.from) > 24)) {
        console.log("Error with time FROM in " + JSON.stringify(element));
        isError = true;
        return;
      } else if ((element.to == undefined)||(Number(element.to) < 0)||(Number(element.to) > 24)) {
        console.log("Error with time TO in " + JSON.stringify(element));
        isError = true;
        return;
      } else if ((element.value == undefined)||(Number(element.value) < 0)) {
        console.log("Error with time VALUE in " + JSON.stringify(element));
        isError = true;
        return;
      }

      let isNewDayTime = false,
          from = element.from, 
          to = element.to,
          setFromTo = () => {
        for (let hour = from; hour < to; hour++) {
          day[hour] = {
            hour: hour,
            devices: [],
            hourCost: element.value / 1000,
            useWatt: 0,
            type: ((hour > (dayStarts - 1)) && (hour < nightStarts)) ? "day" : "night"
          };
        }
      };
      
      if (element.from > element.to) {
        isNewDayTime = true;
        to = 24;
      }

      setFromTo();

      if (isNewDayTime) {
        to = element.to;
        from = 0;
        setFromTo();
      }
    });

    if (isError) {
      console.log("There are error with input values");
      return;
    }
    
  })();

  if (isError) {
    console.log("INPUT ERROR");
    return;
  }

  function dayTasks (type) {
    let hoursSchedule = day.filter(hour => hour.type == type).sort(function (a,b) {
      if (a.hourCost > b.hourCost) {
        return 1;
      }
      if (a.hourCost < b.hourCost) {
        return -1;
      }
      if (a.hourCost == b.hourCost) {
        if ((a.type == "night") && (a.hour >= nightStarts) && (b.hour >= 0) && (b.hour < nightStarts)) {  // to start with night starts
          return -1;
        }
        return 0;
      }
    }),
        actualHourIndex = 0,

        freeHourInfo = Object.create({
          itemHour: hoursSchedule[actualHourIndex].hour,
          restWatt: json.maxPower,
          cost: hoursSchedule[actualHourIndex].hourCost
    });
    
    this.getHours = function () {
      return hoursSchedule;
    };

    this.getFreeHourInfo = function() {
      return freeHourInfo;
    };

    this.setNextHour = function() {
      let newValue = hoursSchedule[actualHourIndex + 1];
      if (newValue != undefined) {
        actualHourIndex += 1;
        freeHourInfo.itemHour = newValue.hour;
        freeHourInfo.restWatt = json.maxPower;
        freeHourInfo.cost = hoursSchedule[actualHourIndex].hourCost;
      } else {
        return false;
      }
      return true;
    };

    this.checkDeviceInCurrentHour = function (deviceId) {
      if (hoursSchedule[actualHourIndex].devices.includes(deviceId)) {
        return true;
      }
      return false;
    }

    this.addDeviceForHour = function (device) {
      hoursSchedule[actualHourIndex].useWatt += device.power;
      hoursSchedule[actualHourIndex].devices.push(device.id);
      freeHourInfo.restWatt -= device.power;
      device.duration -= 1;
    };

    this.checkNextHour = function(power) {
      if (freeHourInfo.restWatt < power) {
        this.setNextHour();
        freeHourInfo.restWatt = json.maxPower;
        freeHourInfo.cost = hoursSchedule[actualHourIndex].hourCost;
        return true;
      }
      return false;
    };
  }

  if ((json.devices.filter(device => device.power > json.maxPower)).length > 0) {
    console.error("You have WRONG POWER DEVICE here");
    return;
  }

  const devices = Object.create(json.devices);
  const toDay = new dayTasks("day"); 
  const toNight = new dayTasks("night"); 

  (function sortDevices () {

    let hourScount = 24,
        devicesDay = devices.filter(device => device.mode == "day"),
        devicesNight = devices.filter(device => device.mode == "night"),
        devicesUniversal = devices.filter(device => device.mode == undefined);

    function maxEffectiveUsageInOur (devices, maxPower) {
      let out = [],
          deviceCount = devices.length;

      function getBestResult (restPower, startElement, outArray) {

        for (let i = startElement; i < deviceCount; i++) {  
          if (restPower >= devices[i].power) {
            
            if (outArray[i] == undefined) {
              outArray[i] = {
                devices: [],
                restPower: restPower
              };
            }

            let newRestPower = restPower - devices[i].power,
                newOutArray = [];
            
            outArray[i].devices.push(devices[i]);
            outArray[i].restPower = newRestPower;

            getBestResult(newRestPower, i+1, newOutArray);

            if (newOutArray.length > 0) {
              newOutArray.sort(function (a, b) {
                if (a.restPower > b.restPower) {
                  return 1;
                }
                if (a.restPower < b.restPower) {
                  return -1;
                }
                return 0;
              });

              outArray[i].devices = outArray[i].devices.concat(newOutArray[0].devices);
              outArray[i].restPower = newOutArray[0].restPower;
            }
          }          
        }
      }

      getBestResult(maxPower, 0, out);
      out.sort(function (a, b) {
        if (a.restPower > b.restPower) {
          return 1;
        }
        if (a.restPower < b.restPower) {
          return -1;
        }
        return 0;
      });

      if (out.length > 0) {
        return out[0].devices;
      }

      return out;
    }
    
    let devicesUniversalTimeOut = () => devicesUniversal.filter(device => ((device.duration > 0) && (device.duration == hourScount))),
        devicesUniversalTimeOutAfterHour = () => devicesUniversal.filter(device => ((device.duration > 0) && (device.duration == (hourScount - 1)))),
        devicesUniversalRest = () => devicesUniversal.filter(device => ((device.duration > 0) && (device.duration < hourScount - 1) && 
        (!toDay.checkDeviceInCurrentHour(device.id)) && (!toNight.checkDeviceInCurrentHour(device.id))));

    function addUniversalDevicesAndCheckForHours (devicesUniversal, dayTimeChooser) { // Check for devices working long hours, and comparing to left ours in our daytime
      
      let hourChanged = false,
          ifTwice = false,
          startHoursCount = hourScount;
      
      devicesUniversal.forEach(function (device) {

        if (!dayTimeChooser.checkDeviceInCurrentHour(device.id)) {
          if (dayTimeChooser.checkNextHour(device.power)) {
            hourScount -= 1;
            hourChanged = true;
            if ((startHoursCount - hourScount) > 1) {
              hourScount += 1;
              ifTwice = true;
            } 
          }
          dayTimeChooser.addDeviceForHour(device);
          
        } 
      });
      if (hourChanged) {
        hourChanged = false;
        addUniversalDevicesAndCheckForHours(devicesUniversalTimeOut(), dayTimeChooser);
      }
      if (ifTwice) {
        hourScount -= 1;
        dayTimeChooser.setNextHour();
        addUniversalDevicesAndCheckForHours(devicesUniversalTimeOut(), dayTimeChooser);
      }
    }
    
    let increment = 2,
        twoHoursModeDevices = devicesUniversalTimeOutAfterHour,
        oneTimeMode = false,
        isFilterOneOff = false,
        isFilterTwoOff = false;

    while (hourScount > 0) {      

      devicesDay = devicesDay.filter(device => device.duration != 0);
      devicesNight = devicesNight.filter(device => device.duration != 0);

      let firstTime = toDay, 
      secondTime = toNight;

      if (firstTime.getFreeHourInfo().cost > secondTime.getFreeHourInfo().cost) {
        secondTime = toDay;
        firstTime = toNight;
      }        
      
      if (!isFilterOneOff) {
        addUniversalDevicesAndCheckForHours(devicesUniversalTimeOut(), firstTime); 
      }

      if (!isFilterTwoOff) {
        addUniversalDevicesAndCheckForHours(twoHoursModeDevices(), secondTime); 
      }

          
      let freeTime = firstTime,
          devicesMain = freeTime === toDay ? devicesDay : devicesNight;

      for (let i = 0; i < 4; i++) {
      
        if (devicesMain.length > 0) {

          maxEffectiveUsageInOur(devicesMain, freeTime.getFreeHourInfo().restWatt).forEach(function (device) { //add universal devices if we have a free power
            if (!freeTime.checkDeviceInCurrentHour(device.id)) {
              freeTime.addDeviceForHour(device);
            }
          });
        }

        if (i == 1) {
          freeTime = secondTime;
          devicesMain = freeTime === toDay ? devicesDay : devicesNight;
        } else {

          devicesMain = devicesUniversalRest();
        }
      }

      
      if (!isFilterOneOff) {
        if (!firstTime.setNextHour()) {
          isFilterOneOff = true;
          oneTimeMode = true;
        }
      }
      
      if (!isFilterTwoOff) {
        if (!secondTime.setNextHour()) {
          isFilterTwoOff = true;
          oneTimeMode = true;
        }
      }
      
      if (oneTimeMode) {
        hourScount -= 1;
        increment = 1;
        twoHoursModeDevices = devicesUniversalTimeOut;
        oneTimeMode = false;
      }

      hourScount -= increment;             
    }
  })();

  let schedule = {},
      consumedEnergy = {};
      devicesList = {},
      value = 0,
      output = {};

  devices.map(device => device).forEach(function (device) {
    let deviceUsage = day.map(hour => hour.devices.includes(device.id) ? hour.hourCost : 0);
    devicesList[`${device.id}`] = Number.parseFloat(Number.parseFloat(deviceUsage.reduce((a, b) => a + b, 0) * device.power).toPrecision(5));
    value += devicesList[`${device.id}`];
  });
  day.forEach(function (hour) {
    schedule[`${hour.hour}`] = hour.devices;
  });

  consumedEnergy.value = Number.parseFloat(Number.parseFloat(value).toPrecision(5));
  consumedEnergy.devices = devicesList;

  output.schedule = schedule;
  output.consumedEnergy = consumedEnergy;
});