---
title: "Why You Should *Curate*, Not Create, a Design System"
description: How strategic curation and targeted customization can elevate your design practice
publishedDate: 2023-11-12
categories:
  - Newsletter
theme: Design
visual:
  version: 1
  theme: Design
  background: warm-dark-gray
  generator:
    type: isoline
    seed: 343
    levels: 12
    scale: 350
    strokeWidth: 0.7
    opacity: 75
    color: copper
  texture: 0
  grain: 24
image: /images/writing/why-you-should-curate-not-create-a-design-system/feature.jpg
canonicalUrl: "https://www.unknownarts.co/p/why-you-should-curate-not-create"
draft: false
---
In software design, it’s tempting to build every component from the ground up.

Industry peer pressure can make you think that creating a bespoke system is the hallmark of innovation and technical prowess. But, in practice, this approach often leads to unnecessary complexity and inefficiency.

I prefer another strategy: **curating a system** – selectively assembling the best existing elements with your own custom creations.

The strength of a software platform lies not in the uniqueness of its components but in how effectively they come together to deliver a product that solves customer problems.

In this article, I want to introduce the idea of strategic curation and highlight a few top-of-mind benefits and concerns that come along with it.

## The case for strategic curation

You don’t have to look far outside the realm of software to find instructive examples of strategically curated business systems.

The physical supply chains of industry giants like Apple and Tesla display a skillful balance of off-the-shelf components, custom-manufactured parts, and in-house innovations. Apple and Tesla customers don’t care whether or not every nut and bolt used to assemble the iPhone or Model 3 was custom built for the project; they care that those chosen pieces combine to create a category leading experience.

As a more specific example, consider Apple’s displays. While Apple's specifications for display panels are high, the fundamental OLED or LCD technology is often sourced from companies like Samsung and LG. Could Apple invent their own display tech? Sure. But by strategically curating from existing, proven elements, it allows the company to direct its creative efforts towards areas that make a bigger impact, like their new, proprietary chipsets. This strategy amplifies, not hinders, their groundbreaking designs.

Strategic curation is about making conscious decisions on where to **innovate** and where to **integrate** (or, as I recently said, [where to design and where to default](https://www.betterbydesign.cc/p/default-it-or-design-it)). When working in this mode, you reserve customization for areas that offer significant competitive differentiation. This means identifying and focusing on elements that augment the unique value of your product. Creating bespoke designs for standard elements like a text input or button likely won’t move the differentiation needle. So, in my experience, it’s been better to integrate worthy existing solutions at this level to allow my teams to innovate where it counts.

Now, let’s explore a couple of benefits and common concerns.

## Benefits

### Improving cost and time efficiency

Building every part of a system from scratch is a herculean effort; it's committing to extensive research, development, testing, and ongoing maintenance. This process consumes valuable resources that could be better used in more strategic areas by most companies.

Curation, in contrast, leverages the wealth of publicly available, well-crafted design elements, dramatically reducing development time and cost. It also enhances agility, allowing for quicker adaptation to market changes and technological advancements. In the startup world where I’ve worked for most of my career, time is of the essence. You might not need to be first to market, but delivering quality solutions quickly is a big advantage.

### Leveraging the experts

Opting for curated elements from reputable sources also brings the advantage of proven quality and expertise.

The startup design teams I’ve worked on have been resource strapped; only a couple of designers to cover the needs of the entire company. We needed designers leaning into their strengths, not struggling with their weaknesses. So outsourcing specific design decisions helped us to operate more effectively and deliver more value to our customers.

One area I outsource regularly is iconography. I’m not great at iconography nor do I aspire to become great at it. So for me, it’s made sense to integrate external icon sources into my work in order to leverage the expertise of real iconography pros.

Another example is data visualization. Designing and building data viz from scratch is challenging, time-consuming, and requires a specific skill set on both sides of the design and engineering aisle. While I have experience in this area, using external libraries made by dedicated experts helps me achieve quality design faster while juggling my other responsibilities.

### Getting ongoing support

When you build complex, bespoke, in-house designs, you put yourself at risk for supporting them over the long haul. Inevitably, whoever designed and built that custom solution will move on to another job and your team will get stuck trying to figure out how to maintain it with little support.

Alternatively, external libraries (whether open source or purchased) foster communities that provide invaluable resources for problem-solving, sharing best practices, and driving continuous innovation. Using them lets you leverage this shared knowledge in your quest to build your software platform and avoid getting stuck.

## Common concerns

### Maintaining brand identity

Designers often fear they’ll lose their product’s unique brand identity in the process of curation. This is an understandable but unfounded fear.

Much of a software product’s unique feel is captured in primitive level theme settings which can be applied to any higher order UI component: typography, color, spacing, effects, etc… So, provided your team sets strong foundations for theming via these systematic primitives, the components you choose shouldn’t limit your ability to create a unique visual identity.

### Balancing familiarity with novelty

As I’ve written about before, [finding the balance between familiarity and novelty is crucial for designing hit products](https://www.betterbydesign.cc/p/special-edition-the-most-advanced). Using a base of familiar components doesn’t reject novelty; it sets the stage for intentionally designing standout novel moments.

iOS design is a good reference for finding this balance in software. iOS comes with a robust set of familiar components that developers can use to create experiences that align with Apple’s standards. Strategically curating Apple’s components allows for a beneficial consistency in the user experience of iOS apps while leaving room for you to add unique elements that differentiate your product. The same thinking applies to web apps, except the core library isn’t clearly provided by a single company.

### Managing resource constraints

When you choose to integrate an external resource into your software, you also accept that resource’s constraints. Once you start building upon that tech, it’s easy to get [“locked in”](https://www.betterbydesign.cc/p/the-subtle-art-of-keeping-your-options) to it, making it hard and expensive to replace with another technology. This means you should pick your libraries wisely, because you’ll likely be with them for the long haul and they set the stage for what’s feasible in your designs.

UI quality can suffer if you change course and start overriding every aspect of an external resource so either lean into that resource’s strengths or cut bait and go a different direction. The only thing worse than a messy bespoke solution is a messy bespoke customization built on top of an external library you don’t control.

## Final thoughts

In conclusion, the art of curation in design systems is more than just a practical approach; it's a strategic imperative in today's rapidly evolving digital landscape. It encourages designers to think critically about each component, to recognize the value of existing solutions, and to direct their creative efforts towards areas where they can make a real difference. This approach doesn’t merely lead to better design; it results in smarter, more sustainable, and impactful products that resonate with users and endure in an ever-changing marketplace.

Until next time,

Patrick
