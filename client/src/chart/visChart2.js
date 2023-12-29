import React, { useEffect, useRef } from 'react';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import vis from 'vis-timeline/standalone/umd/vis-timeline-graph2d.min';

const TimelineComponent = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const now = Date.now();

    const options = {
      stack: true,
      maxHeight: 640,
      horizontalScroll: false,
      verticalScroll: true,
      zoomKey: 'ctrlKey',
      start: now - 1000 * 60 * 60 * 24 * 3, // minus 3 days
      end: now + 1000 * 60 * 60 * 24 * 21, // plus 1 month approx.
      orientation: {
        axis: 'both',
        item: 'top',
      },
    };

    const groups = new vis.DataSet();
    const items = new vis.DataSet();

    const count = 300;

    for (let i = 0; i < count; i++) {
      const start = now + 1000 * 60 * 60 * 24 * (i + Math.floor(Math.random() * 7));
      const end = start + 1000 * 60 * 60 * 24 * (1 + Math.floor(Math.random() * 5));

      groups.add({
        id: i,
        content: 'Task ' + i,
        order: i,
      });

      items.add({
        id: i,
        group: i,
        start: start,
        end: end,
        type: 'range',
        content: 'Item ' + i,
      });
    }

    // create a Timeline
    const container = timelineRef.current;
    const timeline = new vis.Timeline(container, null, options);
    timeline.setGroups(groups);
    timeline.setItems(items);

    const debounce = (func, wait = 100) => {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    };

    const groupFocus = (e) => {
      const vGroups = timeline.getVisibleGroups();
      const vItems = vGroups.reduce((res, groupId) => {
        const group = timeline.itemSet.groups[groupId];
        if (group.items) {
          res = res.concat(Object.keys(group.items));
        }
        return res;
      }, []);
      timeline.focus(vItems);
    };

    timeline.on('scroll', debounce(groupFocus, 200));
    // Enabling the next line leads to a continuous since calling focus might scroll vertically even if it shouldn't
    // timeline.on('scrollSide', debounce(groupFocus, 200));

    // Cleanup function
    return () => {
      timeline.off('scroll', groupFocus);
      // Remove any other event listeners or cleanup code as needed
    };
  }, []); // Empty dependency array ensures that the effect runs only once after the initial render

  const showVisibleGroups = () => {
    const visibleGroups = timelineRef.current.getVisibleGroups();
    document.getElementById('visibleGroupsContainer').innerHTML = visibleGroups.join(', ');
  };

  return (
    <div>
      <h1>Timeline visible Groups</h1>
      <button onClick={showVisibleGroups}>Show current visible items</button>
      <div>
        <h2>visible groups:</h2>
        <h3 id="visibleGroupsContainer"></h3>
        <h2>(Scroll with the mouse and see the items being focus automatically on the timeline)</h2>
      </div>
      <div ref={timelineRef}></div>
      <br />
    </div>
  );
};

export default TimelineComponent;
