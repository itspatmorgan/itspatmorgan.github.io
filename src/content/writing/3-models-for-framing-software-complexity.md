---
title: 3 Models for Framing Software Complexity
description: "Using 37 Signals' visual metaphors to strategically approach software projects"
publishedDate: 2024-04-21
categories:
  - Newsletter
theme: Systems Thinking
tags:
  - Software
  - Technical Design
  - Product Strategy
visual:
  version: 1
  theme: Systems Thinking
  background: warm-dark-gray
  generator:
    type: voronoi
    seed: 300
    count: 60
    jitter: 60
    strokeWidth: 0.6
    opacity: 75
    color: copper
  lightMode:
    color: bronze
    opacity: 100
    strokeWidth: 0.9
  texture: 0
  grain: 24
image: /images/writing/3-models-for-framing-software-complexity/feature.jpg
canonicalUrl: "https://www.unknownarts.co/p/3-models-for-framing-software-complexity"
draft: false
---

The complexity of software is often hidden and abstract, making it hard to develop a sense of the scope of work implied by a design.

This skill is hard-earned - it's a mix of foundational knowledge about software structure and years of experience learning how certain projects surface specific problems.

Engineers naturally develop this muscle through the process of working in the codebase. But designers and product managers don't confront the complexity in the same way, making it harder for them to build this instinct.

No matter your role, your team will benefit from getting better at identifying complexity early, discussing it clearly, and making smart trade-offs to scope projects. A quick gut check on where the bulk of the complexity lies can do wonders for setting realistic design constraints before committing to any direction or timeline.

My favorite metaphor for framing software complexity comes from the team at [37 Signals](https://37signals.com/). Their simple, visual breakdown captures the essence of what I learned during my time as a software engineer. It's helped me approach projects more strategically and communicate more clearly with my teams.

With that context in mind, let's dive into the first of their three models - the Layer Cake distribution.

Source: 37 Signals, Shape Up - Chapter 12

## 1\. Layer Cake

In a layer cake, the complexity is spread evenly across the front end and back end. An even distribution doesn't mean an easy project - it just means the relative weight of the complexity demands equal attention on both sides.

E-commerce platforms tend to exhibit a layer cake-like complexity distribution:

- **Front-End**: The interface needs to be intuitive and engaging. You need to handle product displays, user interactions like cart management, checkout flows, and ensure a responsive design across various devices.
- **Back-End**: There's complexity in wrangling inventory management, integrating with payment gateways, handling user data, managing order history, and more.

There's plenty of complexity on both sides, but weighted similarly. A layer cake project needs a balanced team working in unison from initial design through final development.

Next up is a distribution that catches many designers off-guard - the Back-End Iceberg.

Source: 37 Signals, Shape Up - Chapter 12

## 2\. Back End Iceberg

In a back-end iceberg, the majority of the complexity is hidden from view. These projects can be tricky for designers to approach, as a seemingly simple interface may be deceptively difficult to implement behind the scenes.

I encountered many back-end icebergs during my time designing cybersecurity and data platform companies. For instance, consider creating a machine-learning platform:

- **Front-End**: The interface might be straightforward, aimed at allowing users to upload datasets, initiate training models, and view basic analytics about model performance.
- **Back-End**: Behind the scenes, you have to wrangle large datasets, run data processing pipelines, manage model training and deployment, ensure the scalability of operations, and potentially integrate with multiple other systems.

Heavy back-end complexity requires an engineering-centric team. While designers and developers should still collaborate throughout the project, the lighter load on the designer might free them up to work on additional projects while the engineering team tackles the back-end challenges. Design engineers can act as valuable intermediaries in these situations, helping designers understand the hidden complexity and assisting back-end engineers with prototyping basic UIs before committing to a final design.

Just as back-end complexity can be obscured, the inverse is also true. Let's look at the Front-End Iceberg, where the user interface holds the technical challenges.

Source: 37 Signals, Shape Up - Chapter 12

## 3\. Front End Iceberg

In a front-end iceberg, most of the complexity accumulates in the user interface itself. This visual complexity can deceive you into thinking the back-end is equally challenging, potentially leading to a misallocation of resources.

The main place I encountered front-end icebergs was with data visualization and dashboard projects:

- **Front-End**: The primary challenge lies in presenting complex data in a user-friendly manner. This involves advanced UI components, intricate interactions, customizable views, and more. There's a lot of design nuance required to get it right.
- **Back-End**: While still important, the back-end work might be more straightforward, focused primarily on data retrieval, basic processing, and serving the API endpoints for the front-end to consume.

Heavy front-end complexity demands more design-centric teams. With minimal required back-end development involvement, the focus shifts to close collaboration between front-end developers and designers.

This is another area where design engineers can shine. In-browser UI prototyping plays a crucial role in ensuring the interaction design works seamlessly in a highly stateful environment. Rapidly cycling through iterations - from sketches to code prototypes to polished UI - helps smooth out the overall user experience.

## Final Thoughts

Whichever metaphor best captures your project's reality, the key is being intentional about surfacing and discussing complexity upfront.

This model of layer cakes, back-end icebergs, and front-end icebergs has been invaluable for me in navigating software projects over the years. It's helped me assemble the right teams, allocate resources, and guide design work more strategically.

Versatile roles like design engineers were critical for bridging gaps and facilitating collaboration across disciplines. Their involvement smoothed the process immensely.

Ultimately, this complexity-conscious approach empowered my teams to make well-informed choices, mitigating risks and driving high-quality outcomes. It allowed us to confront stumbling blocks head-on rather than being caught off guard down the line.

I hope unpacking complexity using these models can be as valuable to you as it has been for me. The ability to explicitly frame and discuss it is a game-changer for undertaking any software project with clarity and confidence.

Until next time,

Patrick
