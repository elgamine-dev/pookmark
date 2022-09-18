
import React, {useReducer, useRef, useEffect, useState} from 'react'
import {Segment, Form, Button} from 'semantic-ui-react'

function Share (props) {
    const [state, setState] = useState({added: false, show: false})
    useEffect(() => {
        const parsedUrl = new URL(window.location);

      const title = parsedUrl.searchParams.get('title')
      const text = parsedUrl.searchParams.get('text')
      const url = parsedUrl.searchParams.get('url')
    
      if (title || text || url) {
          console.log(parsedUrl)
          setState({title, text, url, show:true, added:false, link: check([title, text, url]) || ''})
      }
    }, [])
 
    const debug  = process.env.REACT_APP_DEBUG;

    const {title, text} = state

    return <>
        {debug && <ul className={"shared-info"}>
                <li><span>Title:</span> {title}</li>
                <li><span>Text:</span> {text}</li>
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </ul>}
        <ShareForm showAtStart={true} db={props.db} {...state} />
    </>
}


const ADDED = 'added'
const START = 'startSubmit'
const END = 'finishedSubmitting'
const HIDE = 'hide'
const SHOW = 'show'
const reducer = (entries, action) => {
    if (action === HIDE) {
        return {...entries, hidden: true}
    }
    if (action === SHOW) {
        return {...entries, hidden: false}
    }
    if (action === ADDED) {
        return {...entries, added: true, hidden: true}
    }
    if (action === START) {
        return {...entries, submitting: true}
    }
    if (action === END) {
        return {...entries, submitting: false}
    }
}

function ShareForm({title, link, db, showAtStart,added}) {
    const _link = useRef()
    const _title = useRef()
    const [state, dispatch] = useReducer(reducer, {added: added, submitting: false, hidden: !showAtStart})
    
    const submit= (e) => {
        e.preventDefault()
        dispatch(START)
        const text = _title.value
        const link = _link.value
        const created_at = new Date()

        db
        .collection("mookmarks")
        .add({text, link, created_at})
        .then(()=>{
            dispatch(END)
            dispatch(ADDED)
        })
        .catch((err)=>alert(err))
    }

    
    if (state.added) {
        return <span>✓ Link added successfully</span>;
    }

    if (state.submitting) {
        return <span>Saving</span>;
    }

    if (state.hidden) {
        return null
    }

    return (
        <Segment>
            <Form onSubmit={submit}>
                <Form.Field>
                    <input type="text" defaultValue={title} ref={_title}/>
                </Form.Field>
                <Form.Field>
                    <input type="text" defaultValue={link} ref={_link}/>
                </Form.Field>
                <div className={"shared-submit"}><Button onClick={submit}>Add</Button></div>
            </Form>
        </Segment>
    )
}

function extract (string) {
    if (!string) {
        return;
    }
    const matches = string.match(/\bhttps?:\/\/\S+/gi);
    console.log(matches);
    if (!matches) {
        return;
    }
    return matches[0];
}

function check (fields) {
    const found = fields.map(extract).filter(v => v)
    return found.length > 0 && found[0]
}

export default Share