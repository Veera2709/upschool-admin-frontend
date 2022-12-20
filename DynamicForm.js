import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
// react-native-ble-manager
const DynamicForm = () => {
    const topicQuizTemplate = { level: "", duration: "" }

    console.log("topicQuizTemplate", topicQuizTemplate)

    const [topicQuiz, setTopicQuiz] = useState([topicQuizTemplate])

    console.log("topicQuiz", topicQuiz)

    const addTopic = () => {
        setTopicQuiz([...topicQuiz, topicQuizTemplate])
    }


    const onDynamicFormChange = (e, index, fieldType) => {
        console.log("e", e)
        console.log("Field", fieldType)

        const updatedTopics = topicQuiz.map((topic, i) =>
            index == i
                ? Object.assign(topic, { [e.target.name]: e.target.value })
                : topic
        )
        setTopicQuiz(updatedTopics)
    }

    const removeTopic = (index) => {
        const filteredProjects = [...topicQuiz]
        filteredProjects.splice(index, 1)
        setTopicQuiz(filteredProjects)
    }

    const levels = [
        { label: 'Level-1', value: 'Level-1' },
        { label: 'Level-2', value: 'Level-2' },
        { label: 'Level-3', value: 'Level-3' },
    ]

    return (
        <div className='row'>
            {topicQuiz.map((topic, index) => (
                <div className='row'>
                    <div className='col-md-4'>
                        <Form.Select as='select' name="level" id="level" onChange={(e) => onDynamicFormChange(e, index, 'level')} value={topic.level} >
                            {levels.map((ele, i) => {
                                return <option id="level" keys={i} value={ele.value} >{ele.label}</option>
                            })}
                        </Form.Select>
                    </div>
                    <p></p>
                    <div className='col-md-4'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Form.Control
                                    type='number'
                                    name='duration'
                                    value={topic.duration}
                                    onChange={(e) => onDynamicFormChange(e, index, 'duration')}
                                    autoComplete='off'
                                />
                            </div>
                            <div className='col-md-6'>
                            <Button variant='danger' onClick={() => removeTopic(index)}>Remove</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <p></p>
            <p onClick={addTopic} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Add another topic quiz config</p>
        </div>
    )
}

export default DynamicForm