import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refer Friends & Earn Premium" };

export default async function ReferPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/refer");
  }

  // Fetch user profile to get their referral code
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code, subscription_tier(name)")
    .eq("id", user.id)
    .single();

  let referralCode = profile?.referral_code;

  if (!referralCode) {
    // Generate a fallback if migration hasn't populated it yet
    // In production, this should ideally run on user creation via trigger
    referralCode = user.id.split('-')[0].toUpperCase();
    await supabase.from("profiles").update({ referral_code: referralCode }).eq("id", user.id);
  }

  // Fetch referrals
  const { data: referrals } = await supabase
    .from("referrals")
    .select("id, status, created_at, referred:referred_user_id(full_name, email)")
    .eq("referrer_id", user.id);

  const refs = referrals || [];
  const completedCount = refs.filter(r => r.status === 'completed').length;
  const goal = 3;
  const percentage = Math.min((completedCount / goal) * 100, 100);

  // You would replace this with your actual production domain
  const shareLink = `https://catchcolumbus.com/auth/signup?ref=${referralCode}`;

  return (
    <div className="min-h-screen">
      

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Invite Friends.<br/>
            Get <span className="text-yellow-400">Premium Free.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Invite 3 friends to join Catch Columbus. When they sign up, you unlock a free month of Premium access (a $9 value).
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-md text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Your Progress</h2>
          
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50 mb-2 px-2">
            <span>0 Friends</span>
            <span className="text-yellow-400">Premium Unlocked (3)</span>
          </div>

          <div className="w-full h-6 bg-black/40 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full relative transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            >
              {completedCount > 0 && (
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
              )}
            </div>
          </div>

          <p className="text-white/60 mt-4 font-medium">
            You have successfully referred <strong className="text-white">{completedCount}</strong> friends.
            {" "} {completedCount >= 3 ? "You've unlocked Premium!" : `Just ${3 - completedCount} more to go!`}
          </p>
        </div>

        {/* Link Share Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-4">Share your unique link</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              readOnly 
              value={shareLink}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-yellow-100 font-mono focus:outline-none"
            />
            {/* Note: the copy logic requires client-component wrapper in real prod, but left as visual for SSR */}
            <button className="bg-yellow-400 hover:bg-yellow-300 text-[#020C1B] font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-yellow-500/20 shrink-0">
              Copy Link
            </button>
          </div>

          <div className="flex gap-4 justify-center mt-6">
            <a href={`https://twitter.com/intent/tweet?text=Find the best Columbus deals!&url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition">
              𝕏
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Check out Catch Columbus for exclusive local deals: ${shareLink}`)}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition">
               💬
            </a>
            <a href={`mailto:?subject=Join Catch Columbus&body=I found this great site for Columbus deals: ${shareLink}`} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/30 hover:text-white transition">
               ✉️
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
