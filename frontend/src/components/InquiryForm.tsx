'use client';

export default function InquiryForm({ propertyName }: { propertyName: string }) {
  return (
    <div className="bg-[#1c1c1c] text-white p-8 sticky top-32 shadow-2xl">
      <h3 className="font-serif text-2xl mb-6 text-center">
        Indulge in this <span className="text-brand-gold italic">Experience</span>
      </h3>
      
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-widest text-brand-gold mb-1uppercase">FIRST NAME*</label>
            <input type="text" className="w-full bg-white text-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-brand-gold mb-1 uppercase">LAST NAME*</label>
            <input type="text" className="w-full bg-white text-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-widest text-brand-gold mb-1 uppercase">EMAIL*</label>
            <input type="email" className="w-full bg-white text-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold" />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-brand-gold mb-1 uppercase">PHONE</label>
            <input type="tel" className="w-full bg-white text-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold" />
          </div>
        </div>
        
        <div>
          <label className="block text-[10px] tracking-widest text-brand-gold mb-1 uppercase">ARRIVAL & DEPARTURE*</label>
          <input type="text" placeholder="Select Dates" className="w-full bg-white text-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold" />
        </div>
        
        <div>
          <label className="block text-[10px] tracking-widest text-brand-gold mb-1 uppercase">TOTAL GUESTS*</label>
          <select className="w-full bg-white text-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} Guests</option>)}
          </select>
        </div>
        
        <div className="pt-4">
          <button className="w-full bg-brand-gold text-brand-dark hover:bg-white transition-colors py-4 text-sm tracking-[0.2em] font-semibold">
            SUBMIT INQUIRY
          </button>
        </div>
        
        <p className="text-gray-500 text-[10px] text-center mt-4 leading-relaxed">
          Submission of form does not guarantee a reservation, but will expedite the booking process. A Villa Specialist will contact you to confirm or review requested details.
        </p>
      </form>
    </div>
  );
}
