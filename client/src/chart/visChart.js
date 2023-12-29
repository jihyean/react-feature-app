import React, { useEffect, useRef } from 'react';
import vis from 'vis';

const VisChart = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const now = Date.now();

    const options = {
      stack: true,
      maxHeight: 640,
      horizontalScroll: true,
      verticalScroll: true,
      zoomKey: "ctrlKey",
      start: now - 1000 * 60 * 60 * 24 * 3, // minus 3 days
      end: now + 1000 * 60 * 60 * 24 * 21, // plus 1 months aprox.
      orientation: {
        axis: "both",
        item: "top",
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
        content: "Task " + i,
        order: i,
      });

      items.add({
        id: i,
        group: i,
        start: start,
        end: end,
        type: "range",
        content: "Item " + i,
      });
    }

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

    timeline.on("scroll", debounce(groupFocus, 200));

    return () => {
      // Cleanup code if needed
      timeline.destroy();
    };
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return <div ref={timelineRef}></div>;
};

export default VisChart;
