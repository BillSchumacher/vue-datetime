<template>
  <div class="vdatetime">
    <slot name="before"></slot>
    <input class="vdatetime-input"
           :class="inputClass"
           :style="inputStyle"
           :id="inputId"
           type="text"
           :value="inputValue"
           v-bind="$attrs"
           v-on="$listeners"
           @click="open"
           @focus="open">
    <input v-if="hiddenName" type="hidden" :name="hiddenName" :value="value" @input="setValue">
    <slot name="after"></slot>
    <transition-group name="vdatetime-fade" tag="div">
      <div key="overlay" v-if="isOpen" class="vdatetime-overlay" @click.self="cancel"></div>
      <datetime-popup
          key="popup"
          v-if="isOpen"
          :type="type"
          :datetime="popupDate"
          :phrases="phrases"
          :use12-hour="use12Hour"
          :hour-step="hourStep"
          :minute-step="minuteStep"
          :min-datetime="popupMinDatetime"
          :max-datetime="popupMaxDatetime"
          @confirm="confirm"
          @cancel="cancel"
          :auto="auto"
          :week-start="weekStart"
          :flow="flow"
          :title="title">
        <template slot="button-cancel__internal" slot-scope="scope">
          <slot name="button-cancel" v-bind:step="scope.step">{{ phrases.cancel }}</slot>
        </template>
        <template slot="button-confirm__internal" slot-scope="scope">
          <slot name="button-confirm" v-bind:step="scope.step">{{ phrases.ok }}</slot>
        </template>
      </datetime-popup>
    </transition-group>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import DatetimePopup from './DatetimePopup'
import { datetimeFromISO, startOfDay, weekStart } from './util'
import {ZonedDateTime} from "@js-joda/core";
import {
  date_with_regular_time_formatter,
  date_with_slashes_formatter,
  military_time_double_formatter,
  military_time_formatter,
  regular_time_formatter
} from "./time";

export default {
  components: {
    DatetimePopup
  },

  inheritAttrs: false,

  props: {
    value: {
      type: String
    },
    valueZone: {
      type: String,
      default: 'UTC'
    },
    inputId: {
      type: String,
      default: ''
    },
    inputClass: {
      type: [Object, Array, String],
      default: ''
    },
    inputStyle: {
      type: [Object, Array, String],
      default: ''
    },
    hiddenName: {
      type: String
    },
    zone: {
      type: String,
      default: 'local'
    },
    format: {
      type: [Object, String],
      default: null
    },
    type: {
      type: String,
      default: 'date'
    },
    phrases: {
      type: Object,
      default () {
        return {
          cancel: 'Cancel',
          ok: 'Ok'
        }
      }
    },
    use12Hour: {
      type: Boolean,
      default: false
    },
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    minDatetime: {
      type: Object,
      default: null
    },
    maxDatetime: {
      type: Object,
      default: null
    },
    auto: {
      type: Boolean,
      default: false
    },
    weekStart: {
      type: Number,
      default () {
        let now = ZonedDateTime.now(this.valueZone);
        return now.minusDays(now.dayOfWeek().ordinal()).dayOfMonth();
      }
    },
    flow: {
      type: Array
    },
    title: {
      type: String
    }
  },

  data () {
    return {
      isOpen: false,
      datetime: ZonedDateTime.parse(this.value)
    }
  },

  watch: {
    value (newValue) {
      this.datetime = ZonedDateTime.parse(newValue)
    }
  },

  created () {
    this.emitInput()
  },

  computed: {
    inputValue () {
      let format = this.format

      if (!format) {
        switch (this.type) {
          case 'date':
            format = date_with_slashes_formatter
            break
          case 'time':
            if (!this.use12Hour) {
              format = military_time_double_formatter
            } else {
              format = regular_time_formatter
            }
            break
          case 'datetime':
            if (!this.use12Hour) {
              format = date_with_military_time_formatter
            } else {
              format = date_with_regular_time_formatter
            }
            break
          case 'default':
            format = date_with_military_time_formatter
            break
        }
      }

      if (typeof format === 'string') {
        return this.datetime ? ZonedDateTime.parse(this.datetime).atZone(this.zone).format(format) : ''
      } else {
        return this.datetime ? this.datetime.atZone(this.zone).toLocaleString(format) : ''
      }
    },
    popupDate () {
      return this.datetime ? this.datetime.atZone(this.zone) : this.newPopupDatetime()
    },
    popupMinDatetime () {
      return this.minDatetime ? this.minDatetime : null
    },
    popupMaxDatetime () {
      return this.maxDatetime ? this.maxDatetime : null
    }
  },

  methods: {
    emitInput () {
      let datetime = this.datetime ? this.datetime : null

      if (datetime && this.type === 'date') {
        datetime = datetime.atStartOfDay()
      }

      this.$emit('input', datetime ? datetime.toString() : '')
    },
    open (event) {
      event.target.blur()

      this.isOpen = true
    },
    close () {
      this.isOpen = false
      this.$emit('close')
    },
    confirm (datetime) {
      this.datetime = datetime
      this.emitInput()
      this.close()
    },
    cancel () {
      this.close()
    },
    newPopupDatetime () {
      let datetime = ZonedDateTime.now().atZone(this.zone).withSeconds(0).withNanos(0);

      if (this.popupMinDatetime && datetime.isBefore(this.popupMinDatetime)) {
        datetime = this.popupMinDatetime.withSeconds(0).withNanos(0);
      }

      if (this.popupMaxDatetime && datetime.isAfter(this.popupMaxDatetime)) {
        datetime = this.popupMaxDatetime.withSeconds(0).withNanos(0);
      }

      if (this.minuteStep === 1) {
        return datetime
      }

      const roundedMinute = Math.round(datetime.minute / this.minuteStep) * this.minuteStep

      if (roundedMinute === 60) {
        return datetime.plusHours(1).withMinute(0);
      }

      return datetime.withMinute(roundedMinute);
    },
    setValue (event) {
      this.datetime = ZonedDateTime.parse(event.target.value)
      this.emitInput()
    }
  }
}
</script>

<style>
.vdatetime-fade-enter-active,
.vdatetime-fade-leave-active {
  transition: opacity .4s;
}

.vdatetime-fade-enter,
.vdatetime-fade-leave-to {
  opacity: 0;
}

.vdatetime-overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity .5s;
}
</style>
