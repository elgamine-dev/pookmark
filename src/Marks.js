import React, { useEffect, useState } from 'react'

import { Loader, Feed } from 'semantic-ui-react'


function Marks({db}) {
    const [state, setState] = useState({ marks : [], loaded: false, share: null, currentPage:1 })
    const {marks, loaded}  = state;

    useEffect(() => {
        setState(state => ({...state, marks: getCache()}))
    }, [])

    useEffect(()=>{
        db.collection("mookmarks").get().then((querySnapshot) => {
            let marks = [];

           querySnapshot.forEach((doc) => {
               marks.push(doc.data())
           });
           setState(state => ({...state, marks, loaded: true}))
           setCache(marks)
       });
    }, [db])

    const sortedMarks = marks
        .map(a=>{ return {...a, ts: +new Date(a.created_at.seconds * 1000)}})
        .sort((a,b)=>(b.ts-a.ts))
        .map(mark => <Mark key={mark.ts} {...mark} />)

    return <ul>
        {!loaded && <Loader active />}
        {<Feed>{sortedMarks}</Feed>}
    </ul>
}


const Mark = ({text, link, created_at, ts}) => (
    <Feed.Event>
        <Feed.Content>
            <Feed.Summary>
                <a href={link} target="_blanks">{text}</a>
                <Feed.Date>
                    <CreationDate ts={ts} />
                </Feed.Date>
            </Feed.Summary>
        </Feed.Content>
    </Feed.Event>
)

const CreationDate = ({ts}) => {
    return new Date(ts).toLocaleDateString("fr-FR")

}

const setCache = marks => {
    window.localStorage.setItem('marks', JSON.stringify(marks));
}

const getCache = () => {
    const str =  window.localStorage.getItem('marks')
    if (str) {
        return JSON.parse(str)
    }
    return []
}
export default Marks;
