document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    setupEventListeners();
});

function setupEventListeners() {
    console.log('Setting up event listeners');
    const root = document.getElementById('root');
    const allBoxes = document.getElementsByClassName('classBox');
    console.log('Total class boxes found:', allBoxes.length);

    for (const box of allBoxes) {
        box.addEventListener('mouseover', boxOnHover);
        box.addEventListener('mouseout', boxOnLeave);
        box.addEventListener('click', boxOnClick);
    }

    root.addEventListener('click', rootDivClicked);

    const switchColorButton = document.getElementById('switch-color-code');
    if (switchColorButton) {
        switchColorButton.addEventListener('click', toggle_color_code_clicked);
    } else {
        console.error('Switch color code button not found');
    }

    const zoomRangeSlider = document.getElementById('zoom-range-slider');
    if (zoomRangeSlider) {
        zoomRangeSlider.addEventListener('input', zoom_slider_update);
        zoomRangeSlider.addEventListener('change', zoom_slider_update);
    } else {
        console.error('Zoom range slider not found');
    }

    setupArrows();
}

function boxOnHover(event) {
    if (box_focused) return;
    console.log('Box hover:', event.target);
    highlightCourse(event.target);
}

function boxOnLeave() {
    if (box_focused) return;
    console.log('Box leave');
    showAllElements();
}

function boxOnClick(event) {
    console.log('Box click:', event.target);
    focusBox(event.target);
}

function rootDivClicked(event) {
    if (!event.target.classList.contains('classBox') &&
        !event.target.classList.contains('course-code-full') &&
        !event.target.classList.contains('course-name')) {
        console.log('Root div clicked');
        unfocusBox();
    }
}

function zoom_slider_update(event) {
    const zoomValue = event.target.value;
    document.getElementById('zoom-value').innerHTML = zoomValue;
    document.getElementById('root').style.fontSize = `${zoomValue}em`;
}

function highlightCourse(source) {
    while (!source.classList.contains('classBox')) {
        source = source.parentElement;
    }
    console.log('Highlighting course:', source.id);
    const sourceId = source.id;
    const allElements = document.getElementsByClassName('classBox');
    for (const elem of allElements) {
        elem.style.opacity = '0.3';
    }
    source.style.opacity = '1.0';
    const arrows = document.getElementsByClassName(sourceId);
    for (const arrow of arrows) {
        arrow.style.opacity = '1.0';
    }
}

function showAllElements() {
    console.log('Showing all elements');
    const allElements = document.getElementById('root').getElementsByTagName('*');
    for (const elem of allElements) {
        elem.style.opacity = '1.0';
    }
    const allArrows = document.getElementsByTagName('line');
    for (const arrow of allArrows) {
        arrow.style.opacity = '0';
    }
}

let box_focused = false;

function focusBox(source) {
    while (!source.classList.contains('classBox')) {
        source = source.parentElement;
    }
    console.log('Focusing on box:', source.id);
    if (box_focused) {
        unfocusBox();  // Unfocus the previous box if there is one focused
    }
    box_focused = source.id;
    highlightCourse(source);
    document.getElementById('explain-main').style.display = 'block';
    document.getElementById('explain-hint').style.display = 'none';
    document.getElementById('explain-topp').innerHTML = `${source.getElementsByClassName('course-code-full')[0].innerHTML}<br>${source.getElementsByClassName('course-name')[0].innerHTML}`;
    document.getElementById('explain-desc').innerHTML = source.getElementsByClassName('course-description')[0].innerHTML;
    const prereqs = source.getAttribute('prereq').split(' ');
    const prereqList = document.getElementById('explain-prereq-list');
    prereqList.innerHTML = '';
    if (prereqs.length > 0 && prereqs[0] !== '') {
        document.getElementById('explain-prereq-list-div').style.display = 'block';
        prereqs.forEach(prereq => {
            prereqList.innerHTML += `<li>${prereq}</li>`;
        });
    } else {
        document.getElementById('explain-prereq-list-div').style.display = 'none';
    }
}

function unfocusBox() {
    console.log('Unfocusing box');
    if (!box_focused) return;
    box_focused = false;
    showAllElements();
    document.getElementById('explain-main').style.display = 'none';
    document.getElementById('explain-hint').style.display = 'block';
}

function setupArrows() {
    console.log('Setting up arrows');
    const classBoxes = document.getElementsByClassName("classBox");
    const arrow_template = document.getElementById("templates").getElementsByClassName("svg-arrow")[0];

    for (const box of classBoxes) {
        const prereqs = box.getAttribute("prereq");
        if (prereqs) {
            const prereqArray = prereqs.split(" ");
            for (const prereqId of prereqArray) {
                const prereqElement = document.getElementById(prereqId);
                if (prereqElement) {
                    const arrow = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                    arrow.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:1;opacity:0");
                    arrow.setAttribute("marker-end", "url(#arrow)");
                    const x1 = parseFloat(prereqElement.style.left) + 6;
                    const y1 = parseFloat(prereqElement.style.top) + 4.5;
                    const x2 = parseFloat(box.style.left) + 6;
                    const y2 = parseFloat(box.style.top);
                    arrow.setAttribute("x1", `${x1}em`);
                    arrow.setAttribute("y1", `${y1}em`);
                    arrow.setAttribute("x2", `${x2}em`);
                    arrow.setAttribute("y2", `${y2}em`);
                    arrow.classList.add(prereqId);
                    arrow.classList.add(box.id);
                    document.getElementsByClassName("svgConns")[0].appendChild(arrow);
                }
            }
        }
    }
}
