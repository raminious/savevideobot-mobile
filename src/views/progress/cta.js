import React from 'react'
import { Icon, Right } from 'native-base'
import { TouchableOpacity, Text } from 'react-native'
import styles from './styles'

function can(task, op) {
  const { active, done, resumable } = task

  const operations = {
    pause: active && !done && resumable,
    stop: active && !done && !resumable,
    resume: !active && !done && resumable,
    cancel: !active && !done,
    restart: !active && !done && !resumable,
    open: done,
    clear: done
  }

  return operations[op]
}

export default ({
  task,
  taskId,
  onClearTask,
  onRemoveTask,
  onOpenMedia,
  onStopTask,
  onResumeTask
}) => (
  <Right style={styles.widerList}>
    {
      can(task, 'cancel') &&
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onRemoveTask(taskId)}
      >
        <Icon style={[styles.ctaIcon, styles.red]} name="trash" />
      </TouchableOpacity>
    }

    {
      can(task, 'clear') &&
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onClearTask(taskId)}
      >
        <Icon style={[styles.ctaIcon, styles.brown]} name="close-circle" />
      </TouchableOpacity>
    }

    {
      can(task, 'open') &&
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onOpenMedia(taskId)}
      >
        <Icon style={styles.ctaIcon} name="open" />
      </TouchableOpacity>
    }

    {
      can(task, 'pause') &&
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onStopTask(taskId)}
      >
        <Icon style={[styles.ctaIcon, styles.red]} name="pause" />
      </TouchableOpacity>
    }

    {
      can(task, 'stop') &&
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onStopTask(taskId)}
      >
        <Icon style={[styles.ctaIcon, styles.red]} name="hand" />
      </TouchableOpacity>
    }

    {
      can(task, 'resume') &&
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onResumeTask(taskId)}
      >
        <Icon style={[styles.ctaIcon, styles.green]} name="play" />
      </TouchableOpacity>
    }

    {
      can(task, 'restart') &&
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onResumeTask(taskId)}
      >
        <Icon style={styles.ctaIcon} name="refresh" />
      </TouchableOpacity>
    }
  </Right>
)
