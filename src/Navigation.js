import React, {useState} from 'react'
import { useParams, useNavigate, Outlet, useLocation } from "react-router";
import "./Navigation.css"

import { nameToSlug} from './helpers';

function Navigation({projectCategories}) {
    const navigate = useNavigate();
    let { categoryNameSlug } = useParams();
    let location = useLocation()

    const [showCategoryList, setShowCategoryList] = useState(false);

    let allProjectCategories = [
        "All",
        ...projectCategories
    ]

    let categoryIndex = 0;
    if(categoryNameSlug) {
        categoryNameSlug = nameToSlug(categoryNameSlug)
        categoryIndex = allProjectCategories.findIndex((i) => nameToSlug(i) === categoryNameSlug)
        if (categoryIndex < 0) {
            categoryIndex = 0
        }
    }


    let menuText = ""
    let menuUrl = "/"
    if(location.pathname.startsWith("/list")){
        // Currently on list route 
        menuText = "🂠"
        menuUrl = `/view/${categoryNameSlug}/`
    } else {
        // Currently on view route 
        menuText = "☰"
        menuUrl = `/list/${categoryNameSlug}/`
    }

    const categoryButtons = allProjectCategories.map((projectCategory) => {
        let categoryUrl = ""
        if(location.pathname.startsWith("/list")){
            categoryUrl = `/list/${nameToSlug(projectCategory)}/`
        } else {
            categoryUrl = `/view/${nameToSlug(projectCategory)}/`
        }
        return <button key={projectCategory} className="categorylist-button" onClick={() => {
            setShowCategoryList(false) 
            navigate(categoryUrl)
        }}>
            <span>{projectCategory}</span>
        </button>
    })
    const category_jsx = <div id="modal" onClick={() => setShowCategoryList(false)}>
        <div>
            <h1>Category Filter</h1>
            {categoryButtons}
        </div>
    </div>

    return <div>
    <button key="menu" id="menu-button" onClick={() => navigate(menuUrl)}>{menuText}</button>
    <button key="category" id="category-button" onClick={() => setShowCategoryList(true)}>
        <span>Category: {allProjectCategories[categoryIndex]}</span>
    </button>
    {showCategoryList ? category_jsx : null}

    <Outlet />
</div>

}

export default Navigation;