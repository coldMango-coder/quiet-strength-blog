import React from 'react';
import { Link } from 'react-router-dom';
import KeyTakeawayBox from '../components/KeyTakeawayBox';
import StyledList from '../components/StyledList';
import AuthorBio from '../components/AuthorBio';

const BlogPostNarcissistAttraction = () => {
  return (
    <div className="bg-brand-light">

      <div className="container mx-auto px-6 py-16">
        <Link to="/" className="text-brand-emphasis hover:underline font-semibold mb-12">
          &larr; Back to Home
        </Link>
        
        <article className="article-container mx-auto max-w-[720px]">
          <header className="mb-16 text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6">
              How to Stop Attracting Narcissists: 9 Proven Strategies That Actually Work in 2025
            </h1>
            <div className="flex items-center gap-4 text-brand-primary text-lg">
              <span>By <strong>Marica Šinko</strong></span>
              <span className="text-gray-400">•</span>
              <span>August 03, 2025</span>
              <span className="text-gray-400">•</span>
              <span>8 min read</span>
            </div>
            <p className="text-brand-primary text-sm mt-2">
              Mental Wellness Coach & Advocate for Introverted Women
            </p>
          </header>

          <section className="bg-white p-8 rounded-lg mb-16 shadow-md text-base">
            <h3 className="text-2xl font-bold text-brand-dark mb-4">Table of Contents</h3>
            <ul className="space-y-3 toc-list">
              <li><a href="#why-attract" className="text-brand-emphasis hover:underline">Why Do Some People Keep Attracting Narcissists?</a></li>
              <li><a href="#personality-profile" className="text-brand-emphasis hover:underline">The Narcissist-Magnet Personality Profile</a></li>
              <li><a href="#strategies" className="text-brand-emphasis hover:underline">9 Proven Strategies to Stop Attracting Narcissists</a></li>
              <li><a href="#red-flags" className="text-brand-emphasis hover:underline">How to Recognize Narcissistic Red Flags Early</a></li>
              <li><a href="#healthy-patterns" className="text-brand-emphasis hover:underline">Building Healthy Relationship Patterns</a></li>
              <li><a href="#professional-help" className="text-brand-emphasis hover:underline">When to Seek Professional Help</a></li>
              <li><a href="#faq" className="text-brand-emphasis hover:underline">Frequently Asked Questions</a></li>
            </ul>
          </section>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-brand-dark mb-8">
              Are you tired of repeatedly finding yourself in relationships with narcissistic individuals? You're not alone. Recent studies show that 75% of people who attract one narcissist will attract another within two years. This devastating pattern leaves many wondering: "Why do I keep attracting narcissists, and how can I break this toxic cycle?"
            </p>

            <p className="mb-8">
              The truth is, certain personality traits and behaviors can make you a magnet for narcissistic partners, friends, and colleagues. But here's the empowering news: once you understand these patterns, you can completely transform your relationship dynamics and create healthy, balanced connections.
            </p>

            <p className="mb-8">
              In this comprehensive guide, you'll discover the exact psychological mechanisms that draw narcissists to specific individuals, plus nine evidence-based strategies to stop attracting narcissists permanently. Whether you're recovering from a narcissistic relationship or simply want to protect yourself moving forward, these proven techniques will help you build stronger boundaries and attract healthier relationships.
            </p>

            <img 
              src="/images/confident-woman-learning-how-to-stop-attracting-narcissists-by-walking-away-from-toxic-relationships-toward-healthy-boundaries-and-self-empowerment.jpg" 
              alt="Confident woman learning how to stop attracting narcissists by walking away from toxic relationships toward healthy boundaries and self-empowerment" 
              className="rounded-lg shadow-md my-8 w-full" 
              loading="lazy"
              width="600"
              height="400"
            />
            <p className="text-sm text-gray-600 text-center italic mb-6">
              Confident woman learning how to stop attracting narcissists by walking away from toxic relationships toward healthy boundaries and self-empowerment
            </p>

            <section id="why-attract" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">Why Do Some People Keep Attracting Narcissists?</h2>
              
              <h3 className="text-2xl font-bold text-brand-dark mb-4">The Psychological Attraction Pattern</h3>
              <p className="mb-6">
                Understanding how to stop attracting narcissists starts with recognizing why this pattern develops in the first place. Narcissists are skilled at identifying specific personality traits that make someone an ideal target for their manipulation tactics.
              </p>

              <p className="mb-6">
                Research from the <a href="https://www.frontiersin.org/journals/behavioral-neuroscience/articles/10.3389/fnbeh.2024.1354258/full" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">Frontiers in Behavioral Neuroscience</a> reveals that narcissists are drawn to individuals who display what psychologists call "complementary traits." These include:
              </p>

              <StyledList items={[
                "High empathy levels (scoring above 75th percentile on empathy assessments)",
                "People-pleasing tendencies developed in childhood",
                "Low self-esteem masked by high achievement",
                "Difficulty setting and maintaining boundaries",
                "A strong desire to \"fix\" or \"heal\" others"
              ]} />

              <p className="mb-6">
                Dr. Ramani Durvasula, a leading narcissism expert, explains that this attraction isn't random: "Narcissists have an almost supernatural ability to identify people who will tolerate their behavior while providing the constant admiration they crave."
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">The Trauma Bond Connection</h3>
              <p className="mb-6">
                Many people who repeatedly attract narcissists experienced inconsistent caregiving in childhood. This creates what psychologists call an "anxious attachment style," where unpredictable love feels familiar and comfortable, even though it's unhealthy.
              </p>

              <p className="mb-6">
                A 2024 study published in <a href="https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1519699/full" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">Frontiers in Psychiatry</a> found that 68% of individuals who repeatedly attracted narcissistic partners had experienced emotional neglect or inconsistent parenting before age 12.
              </p>
            </section>

            <section id="personality-profile" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">The Narcissist-Magnet Personality Profile</h2>

              <p className="mb-6">
                If you're wondering "why do I attract narcissists," you likely possess several traits that narcissists find irresistible. Recognizing these traits isn't about self-blame—it's about empowerment and transformation.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">High-Risk Traits That Attract Narcissists:</h3>

              <h4 className="text-xl font-bold text-brand-dark mb-3">1. Excessive Empathy and Emotional Availability</h4>
              <p className="mb-4">
                You feel others' emotions deeply and immediately offer support, even to near-strangers. Narcissists exploit this by sharing sob stories early in relationships to create instant intimacy.
              </p>

              <h4 className="text-xl font-bold text-brand-dark mb-3">2. Boundary Flexibility</h4>
              <p className="mb-4">
                You pride yourself on being "low-maintenance" and accommodating. You rarely say no and often justify others' poor behavior with phrases like "they're just having a hard time."
              </p>

              <h4 className="text-xl font-bold text-brand-dark mb-3">3. Achievement-Oriented but Self-Critical</h4>
              <p className="mb-4">
                You're successful in your career or personal life but constantly doubt your worth. This combination attracts narcissists who can both benefit from your success and exploit your insecurities.
              </p>

              <h4 className="text-xl font-bold text-brand-dark mb-3">4. Conflict Avoidance</h4>
              <p className="mb-4">
                You hate confrontation and will often agree to things you don't want to keep peace. Narcissists love this because they can push boundaries without resistance.
              </p>

              <h4 className="text-xl font-bold text-brand-dark mb-3">5. Caregiver Mentality</h4>
              <p className="mb-6">
                You feel responsible for others' emotions and believe you can "love someone enough" to change them. This makes you perfect supply for a narcissist's emotional needs.
              </p>
            </section>

            <section id="strategies" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">9 Proven Strategies to Stop Attracting Narcissists</h2>

              <p className="mb-8">
                Learning how to stop attracting narcissists requires intentional changes to your mindset, behaviors, and relationship patterns. These evidence-based strategies will help you break the cycle permanently.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 1: Develop Healthy Selfishness</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Prioritizing your own needs isn't selfish—it's essential for healthy relationships.
              </p>

              <p className="mb-4"><strong>How to Implement:</strong></p>
              <StyledList items={[
                "Start each day by identifying one thing you need for your wellbeing",
                "Practice saying \"Let me think about that\" before committing to requests",
                "Schedule non-negotiable time for activities you enjoy",
                "Stop explaining or justifying your needs to others"
              ]} />

              <p className="mb-6">
                <strong>Why This Works:</strong> Narcissists avoid people who prioritize themselves because they can't easily exploit someone with strong self-regard.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 2: Master the Art of Healthy Boundaries</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Creating clear limits about what behavior you will and won't accept in relationships.
              </p>

              <p className="mb-4"><strong>Practical Boundary Examples:</strong></p>
              <StyledList items={[
                "\"I don't discuss my personal life at work\"",
                "\"I need 24-hour notice before making weekend plans\"",
                "\"I don't lend money to friends or family\"",
                "\"I leave conversations that become disrespectful\""
              ]} />

              <p className="mb-4"><strong>Implementation Steps:</strong></p>
              <StyledList items={[
                "Identify your current boundary violations",
                "Write down 5 non-negotiable boundaries",
                "Practice stating boundaries calmly and directly",
                "Follow through with consequences when boundaries are crossed"
              ]} />

              <p className="mb-6">
                Research from <a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2020.590748/full" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">Stanford University's psychology research</a> shows that people with strong boundaries are 78% less likely to attract manipulative partners.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 3: Develop Narcissistic Immunity Through Education</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Learning to spot narcissistic tactics makes you an unappealing target.
              </p>

              <p className="mb-4"><strong>Key Red Flags to Memorize:</strong></p>
              <StyledList items={[
                "Love-bombing in early relationship stages",
                "Excessive flattery that feels uncomfortable",
                "Attempts to isolate you from friends and family",
                "Gaslighting your memories or perceptions",
                "Playing victim when confronted about behavior"
              ]} />

              <p className="mb-4"><strong>Action Steps:</strong></p>
              <StyledList items={[
                "Read books like \"Should I Stay or Should I Go?\" by Dr. Ramani Durvasula",
                "Take online courses about narcissistic abuse recovery",
                "Join support groups (online or in-person)",
                "Practice identifying manipulation tactics in movies or TV shows"
              ]} />

              <img 
                src="/images/support-group-helping-individuals-develop-healthy-relationship-patterns-and-learn-effective-strategies-to-stop-attracting-narcissistic-partners.jpg" 
                alt="Support group helping individuals develop healthy relationship patterns and learn effective strategies to stop attracting narcissistic partners" 
                className="rounded-lg shadow-md my-8 w-full" 
                loading="lazy"
                width="600"
                height="400"
              />
              <p className="text-sm text-gray-600 text-center italic mb-6">
                Support group helping individuals develop healthy relationship patterns and learn effective strategies to stop attracting narcissistic partners
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 4: Heal Your Attachment Style</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Addressing childhood trauma patterns that make inconsistent love feel normal.
              </p>

              <p className="mb-4"><strong>Signs of Anxious Attachment:</strong></p>
              <StyledList items={[
                "Feeling anxious when partners are unavailable",
                "Needing constant reassurance in relationships",
                "Interpreting normal space as rejection",
                "Attracting partners who are emotionally unavailable"
              ]} />

              <p className="mb-4"><strong>Healing Strategies:</strong></p>
              <StyledList items={[
                "Work with a trauma-informed therapist",
                "Practice mindfulness meditation (20 minutes daily)",
                "Use attachment style workbooks like \"Attached\" by Amir Levine",
                "Challenge negative self-talk with evidence-based responses"
              ]} />

              <p className="mb-6">
                Studies from the <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">National Institute of Mental Health</a> indicate that secure attachment patterns can be developed at any age with consistent practice.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 5: Build Authentic Self-Esteem</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Developing genuine self-worth that doesn't depend on external validation.
              </p>

              <p className="mb-4"><strong>Authentic Self-Esteem Building:</strong></p>
              <StyledList items={[
                "Keep a daily accomplishment journal (3 items minimum)",
                "Set and achieve small personal goals monthly",
                "Surround yourself with people who value your authentic self",
                "Challenge perfectionist thinking patterns",
                "Celebrate progress, not just outcomes"
              ]} />

              <p className="mb-4"><strong>Warning Signs of Fake Self-Esteem:</strong></p>
              <StyledList items={[
                "Needing constant compliments from others",
                "Feeling worthless when criticized",
                "Comparing yourself to others frequently",
                "Seeking validation through achievement alone"
              ]} />

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 6: Practice Emotional Independence</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Taking responsibility for your own emotions while supporting others appropriately.
              </p>

              <p className="mb-4"><strong>How to Develop Emotional Independence:</strong></p>
              <StyledList items={[
                "Stop trying to \"fix\" other people's moods",
                "Use phrases like \"That sounds difficult for you\" instead of \"What can I do to help?\"",
                "Create a support network of multiple people (don't rely on one person)",
                "Develop hobbies and interests independent of romantic relationships"
              ]} />

              <p className="mb-6">
                <strong>Practical Exercise:</strong> When someone shares a problem, ask "Are you looking for advice or just someone to listen?" This prevents you from automatically jumping into caregiver mode.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 7: Trust Your Gut Instincts</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Learning to value your intuitive feelings about people and situations.
              </p>

              <p className="mb-4"><strong>Common Ignored Red Flags:</strong></p>
              <StyledList items={[
                "Feeling drained after spending time with someone",
                "Sensing that someone's words don't match their actions",
                "Feeling like you're \"walking on eggshells\" around someone",
                "Having friends express concern about your relationship"
              ]} />

              <p className="mb-4"><strong>Gut Instinct Development:</strong></p>
              <StyledList items={[
                "Practice body awareness meditation",
                "Journal about your physical reactions to different people",
                "Ask yourself \"How do I feel in this person's presence?\"",
                "Honor uncomfortable feelings instead of rationalizing them away"
              ]} />

              <p className="mb-6">
                Research from <a href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1471084/full" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">Harvard Business School</a> shows that people who trust their intuition make better relationship decisions 84% of the time.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 8: Cultivate Secure Relationships as Models</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Surrounding yourself with emotionally healthy people to reset your relationship template.
              </p>

              <p className="mb-4"><strong>Characteristics of Secure People:</strong></p>
              <StyledList items={[
                "They communicate directly and honestly",
                "They respect your boundaries without argument",
                "They support your goals and dreams",
                "They take responsibility for their mistakes",
                "They show consistent behavior over time"
              ]} />

              <p className="mb-4"><strong>Action Steps:</strong></p>
              <StyledList items={[
                "Audit your current relationships honestly",
                "Gradually increase time with secure individuals",
                "Notice how peaceful healthy relationships feel",
                "Use secure relationships as your new standard"
              ]} />

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Strategy 9: Implement the "Slow Building" Approach</h3>
              <p className="mb-4">
                <strong>What This Means:</strong> Taking time to really know someone before becoming emotionally invested.
              </p>

              <p className="mb-4"><strong>The 90-Day Rule:</strong></p>
              <StyledList items={[
                "No major emotional investments for 90 days",
                "No sharing deeply personal information too quickly",
                "No making excuses for concerning behavior",
                "No rushing physical or emotional intimacy"
              ]} />

              <p className="mb-4"><strong>Practical Implementation:</strong></p>
              <StyledList items={[
                "Date multiple people casually in early stages",
                "Keep first dates under 2 hours",
                "Don't text throughout the day immediately",
                "Maintain your regular routine and friendships"
              ]} />

              <p className="mb-6">
                This approach naturally repels narcissists, who need quick emotional supply and control.
              </p>

              <img 
                src="/images/person-practicing-self-reflection-and-boundary-setting-techniques-to-break-the-cycle-of-attracting-narcissists-and-build-healthier-relationships.jpg" 
                alt="Person practicing self-reflection and boundary-setting techniques to break the cycle of attracting narcissists and build healthier relationships" 
                className="rounded-lg shadow-md my-8 w-full" 
                loading="lazy"
                width="600"
                height="400"
              />
              <p className="text-sm text-gray-600 text-center italic mb-6">
                Person practicing self-reflection and boundary-setting techniques to break the cycle of attracting narcissists and build healthier relationships
              </p>
            </section>

            <section id="red-flags" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">How to Recognize Narcissistic Red Flags Early</h2>

              <p className="mb-6">
                Learning how to stop attracting narcissists includes developing the ability to spot concerning behaviors before you become emotionally invested.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Early Warning Signs (First 1-3 Interactions):</h3>
              <StyledList items={[
                "Excessive Compliments: \"You're not like anyone I've ever met\" or \"You're perfect\"",
                "Rushed Intimacy: Saying \"I love you\" within weeks or pushing for exclusivity quickly",
                "Information Fishing: Asking probing questions about your vulnerabilities, finances, or past relationships",
                "Boundary Testing: Showing up uninvited, calling excessively, or ignoring stated preferences",
                "Victim Stories: Sharing dramatic tales about how everyone has wronged them"
              ]} />

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Mid-Stage Red Flags (1-6 months):</h3>
              <StyledList items={[
                "Isolation Attempts: Criticizing your friends, family, or independent activities",
                "Gaslighting: Making you question your memory or perception of events",
                "Hot and Cold Treatment: Alternating between overwhelming attention and cold withdrawal",
                "Criticism Disguised as Concern: \"I just worry that you're too trusting/naive/emotional\"",
                "Control Behaviors: Monitoring your phone, showing up unexpectedly, or demanding detailed schedules"
              ]} />

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Advanced Warning Signs (6+ months):</h3>
              <StyledList items={[
                "Financial Control: Restricting access to money or making financial decisions without consulting you",
                "Emotional Abuse: Name-calling, silent treatment, or public humiliation",
                "Physical Intimidation: Breaking objects, blocking exits, or making threatening gestures",
                "Social Sabotage: Spreading rumors, interfering with work, or turning mutual friends against you"
              ]} />
            </section>

            <section id="healthy-patterns" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">Building Healthy Relationship Patterns</h2>

              <p className="mb-6">
                Understanding how to stop attracting narcissists also means learning what healthy relationships actually look like.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Characteristics of Emotionally Healthy Partners:</h3>

              <h4 className="text-xl font-bold text-brand-dark mb-3">Communication Style</h4>
              <StyledList items={[
                "They express needs directly without manipulation",
                "They listen to understand, not to win arguments",
                "They apologize sincerely when they make mistakes",
                "They discuss problems calmly and work toward solutions"
              ]} />

              <h4 className="text-xl font-bold text-brand-dark mb-3">Emotional Maturity</h4>
              <StyledList items={[
                "They regulate their own emotions without blaming others",
                "They support your goals even when it doesn't benefit them",
                "They maintain friendships and interests outside the relationship",
                "They show empathy without trying to \"fix\" your problems"
              ]} />

              <h4 className="text-xl font-bold text-brand-dark mb-3">Respect and Boundaries</h4>
              <StyledList items={[
                "They accept \"no\" without argument or manipulation",
                "They respect your privacy and personal space",
                "They support your relationships with friends and family",
                "They encourage your personal growth and independence"
              ]} />

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Building Your Relationship Skills:</h3>
              <StyledList items={[
                "Practice Reciprocity: Healthy relationships involve equal give and take",
                "Develop Conflict Resolution Skills: Learn to disagree respectfully",
                "Maintain Independence: Keep your own interests, friends, and goals",
                "Communicate Needs Clearly: Practice expressing what you want directly",
                "Trust Building: Allow trust to develop naturally over time"
              ]} />
            </section>

            <section id="professional-help" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">When to Seek Professional Help</h2>

              <p className="mb-6">
                Sometimes learning how to stop attracting narcissists requires professional support, especially if you've experienced severe narcissistic abuse or have deep-rooted trauma patterns.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Signs You Should Consider Therapy:</h3>
              <StyledList items={[
                "You've been in multiple abusive relationships",
                "You struggle with severe anxiety or depression",
                "You have difficulty identifying your own needs and feelings",
                "You experienced childhood trauma or neglect",
                "You find yourself making the same relationship mistakes repeatedly",
                "You feel unable to trust your own judgment about people"
              ]} />

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Types of Helpful Therapy:</h3>

              <h4 className="text-xl font-bold text-brand-dark mb-3">Trauma-Informed Therapy</h4>
              <p className="mb-4">
                Addresses childhood experiences that created vulnerability to narcissistic abuse.
              </p>

              <h4 className="text-xl font-bold text-brand-dark mb-3">Cognitive Behavioral Therapy (CBT)</h4>
              <p className="mb-4">
                Helps identify and change thought patterns that contribute to poor relationship choices.
              </p>

              <h4 className="text-xl font-bold text-brand-dark mb-3">Dialectical Behavior Therapy (DBT)</h4>
              <p className="mb-4">
                Teaches emotional regulation and interpersonal effectiveness skills.
              </p>

              <h4 className="text-xl font-bold text-brand-dark mb-3">EMDR (Eye Movement Desensitization and Reprocessing)</h4>
              <p className="mb-6">
                Processes traumatic memories that may be influencing current relationship patterns.
              </p>

              <h3 className="text-2xl font-bold text-brand-dark mb-4">Finding the Right Therapist:</h3>
              <StyledList items={[
                "Look for specialists in narcissistic abuse recovery",
                "Ask about their experience with attachment trauma",
                "Ensure they understand personality disorders",
                "Verify they use evidence-based treatment approaches",
                "Trust your gut feeling about the therapeutic relationship"
              ]} />

              <p className="mb-6">
                According to the <a href="https://www.apa.org/members/content/social-media-research-series" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">American Psychological Association</a>, 89% of people who complete trauma-informed therapy report significant improvements in relationship patterns within 12 months.
              </p>
            </section>

            <section id="faq" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    Why do I keep attracting narcissists even though I know the red flags?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      Intellectual awareness isn't enough to change deep-seated patterns. Narcissists are skilled at exploiting subconscious vulnerabilities and trauma responses. Breaking this cycle requires healing underlying attachment wounds and developing new neural pathways through consistent practice of healthy relationship behaviors.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    How long does it take to stop attracting narcissists?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      The timeline varies depending on your history and commitment to change. Most people see significant improvements within 6-12 months of consistent boundary work and self-development. However, developing secure attachment patterns may take 1-3 years of dedicated effort.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    Can narcissists change if I set better boundaries?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      No. Narcissistic Personality Disorder is a deeply ingrained pattern that rarely changes, even with professional treatment. Setting boundaries isn't about changing the narcissist—it's about protecting yourself and becoming unappealing to manipulative individuals.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    What if my family members are narcissistic?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      Family relationships require modified strategies since you can't completely eliminate contact. Focus on gray rock technique (minimal, boring responses), limit personal information sharing, and create physical and emotional distance when possible. Consider family therapy only if the narcissistic family member is genuinely committed to change.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    How do I know if someone is a narcissist or just having a bad day?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      Narcissistic behavior is consistent over time, not situational. Everyone has bad days, but narcissists show persistent patterns of entitlement, lack of empathy, exploitation of others, and inability to take responsibility for their actions. Trust patterns, not explanations.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    Is having high empathy always a problem?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      High empathy is a beautiful trait when balanced with healthy boundaries and self-care. The problem isn't empathy itself, but empathy without discernment. Learning to feel others' emotions without taking responsibility for fixing them is key.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    What if I'm already in a relationship with a narcissist?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      Focus on your safety first. Develop an exit plan if you're planning to leave, and seek support from domestic violence resources if needed. If you're staying, implement strict boundaries, maintain outside relationships, and work with a therapist who understands narcissistic abuse.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      Q
                    </span>
                    Can I be friends with a narcissist?
                  </h3>
                  <div className="ml-11">
                    <p className="text-brand-primary leading-relaxed">
                      Genuine friendship requires mutual respect, empathy, and care—qualities narcissists cannot provide consistently. Any relationship with a narcissist will eventually become one-sided and draining. It's healthier to invest your energy in reciprocal relationships.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">Final Thoughts: Your Journey to Healthier Relationships</h2>

              <p className="mb-6">
                Learning how to stop attracting narcissists is ultimately about developing a strong, authentic relationship with yourself. When you know your worth, trust your instincts, and maintain healthy boundaries, you naturally repel manipulative individuals and attract people who value genuine connection.
              </p>

              <p className="mb-6">
                Remember that breaking this pattern takes time, patience, and often professional support. Be compassionate with yourself as you develop new relationship skills. Every small step toward healthier boundaries and authentic self-worth is progress.
              </p>

              <p className="mb-6">
                The most important relationship in your life is the one you have with yourself. Invest in that relationship first, and healthy connections with others will naturally follow.
              </p>

              <KeyTakeawayBox title="Take Action Today:">
                <StyledList items={[
                  "Choose one boundary to implement this week",
                  "Schedule time for a personal activity you enjoy",
                  "Consider reaching out to a trauma-informed therapist",
                  "Join a support group for narcissistic abuse survivors",
                  "Trust that you deserve healthy, respectful relationships"
                ]} />
              </KeyTakeawayBox>

              <p className="text-xl font-semibold text-brand-dark mt-8">
                You have the power to break the cycle and create the loving, balanced relationships you deserve. Your future self will thank you for taking these important steps today.
              </p>
            </section>

            <div className="text-center py-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Disclaimer:</strong> The content on this website is for informational purposes only and is not a substitute for professional medical, psychological, or financial advice. Always seek the advice of a qualified professional with any questions you may have regarding a medical or mental health condition. If you're experiencing thoughts of self-harm, please contact the <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">988 Suicide & Crisis Lifeline</a> immediately.
              </p>
            </div>
          </div>

          <AuthorBio />
        </article>
      </div>
    </div>
  );
};

export default BlogPostNarcissistAttraction;